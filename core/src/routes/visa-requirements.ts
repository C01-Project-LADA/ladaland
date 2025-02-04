import express, { Request, Response } from 'express';
import { PrismaClient, VisaRequirement } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface RequirementRank {
  rank: number;
  days: number | null;
}

function getRequirementRank(requirement: string): RequirementRank {
  if (/^\d+$/.test(requirement)) {
    return { rank: 1, days: parseInt(requirement, 10) };
  }
  if (requirement === 'visa free') {
    return { rank: 1, days: null };
  }
  if (requirement === 'visa on arrival') {
    return { rank: 2, days: null };
  }
  if (requirement === 'eta') {
    return { rank: 3, days: null };
  }
  if (requirement === 'e-visa') {
    return { rank: 4, days: null };
  }
  if (requirement === 'visa required') {
    return { rank: 5, days: null };
  }
  return { rank: 99, days: null };
}

interface VisaRequirementRequestBody {
  passports: string[];
}

interface VisaRequirementForPassport {
  destination: string;
  requirement: string;
  passport: string;
}

router.post(
  '/visa-requirements',
  async (
    req: Request<{}, {}, VisaRequirementRequestBody>,
    res: Response
  ): Promise<void> => {
    try {
      const { passports } = req.body;
      if (!passports || !Array.isArray(passports) || passports.length === 0) {
        res
          .status(400)
          .json({ error: 'Passports must be provided as a non-empty array.' });
        return;
      }

      const visaRows: VisaRequirement[] = await prisma.visaRequirement.findMany(
        {
          where: {
            passport: { in: passports },
            requirement: { not: '-1' },
            destination: { notIn: passports },
          },
        }
      );

      const destinationMap: { [destination: string]: VisaRequirement[] } = {};
      visaRows.forEach((row) => {
        if (!destinationMap[row.destination]) {
          destinationMap[row.destination] = [];
        }
        destinationMap[row.destination].push(row);
      });

      const results: VisaRequirementForPassport[] = [];
      for (const destination in destinationMap) {
        const rows = destinationMap[destination];
        let bestOption = rows[0];

        for (let i = 1; i < rows.length; i++) {
          const currentOption = rows[i];
          const bestRank = getRequirementRank(bestOption.requirement);
          const currentRank = getRequirementRank(currentOption.requirement);

          if (currentRank.rank < bestRank.rank) {
            bestOption = currentOption;
          } else if (
            currentRank.rank === bestRank.rank &&
            currentRank.rank === 1
          ) {
            if (
              currentRank.days !== null &&
              bestRank.days !== null &&
              currentRank.days > bestRank.days
            ) {
              bestOption = currentOption;
            } else if (currentRank.days !== null && bestRank.days === null) {
              bestOption = currentOption;
            }
          }
        }

        results.push({
          destination,
          requirement: bestOption.requirement,
          passport: bestOption.passport,
        });
      }

      res.json(results);
    } catch (error) {
      console.error('Error in /visa-requirements route:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while processing the request.' });
    }
  }
);

export default router;
