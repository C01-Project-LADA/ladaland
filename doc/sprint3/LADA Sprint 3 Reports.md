### Performance Testing Report

There is an file `lada_lighthouserun.html` in the same directory as this file where you can see our lighthouse run from our dashboard. While the run may see mediocre at first it is important to consider our objectives with this site.
##### Analysis:

Performance (63):

While not an ideal score our `First Contentful Paint` came in at a wonderful 0.4s and our `Largest Contentful Paint` came in at 0.9s. These values mean that users have their attention quickly captivated and while they may be waiting another second to get the remainder loaded they are unlikely to lose attention. With this being our heaviest page the remainder of the site should continue to perform even better than this. These values are acceptable for our requirements.

Accessibility (75):

Accessibility was not a primary objective of ours and while it is definitely a feature for us to consider down the road, in the meantime a score of 75 is acceptable.

Best Practices (100):

A perfect score!

SEO (91):

A great score for our expectations!

### Security Measures & Testing

As stated in our NFR Report:

Security was chosen as a top priority to protect sensitive user data, including personal details and travel plans. Our system utilized bcrypt with multi-round salting to ensure secure accounts and we enforce HTTPS on our site to protect our users again various attacks such as man-in-the-middle attacks. In today’s landscape, ensuring data protection and privacy is essential for maintaining user trust and complying with industry standards.
### Scalability & Availability Considerations

As stated in our NFR Report:

Given our sites potential for rapid growth scalability was chosen so the system can gracefully handle increases in both the number of users and data volume. We designed our architecture to scale horizontally using cloud resources. In particular we opted to host our site on a VM via the Google Compute Engine. With deployment on Google Cloud Platform, we want to ensure that our application remains responsive under peak loads and can grow alongside our user base without significant rework.

Additionally our deployment strategy uses a **fully automated** CI/CD pipeline which, upon a successful merge to master (meaning we have released a new version), will perform the following steps:

1. Build a docker image for both core and client
2. Push them to docker hub
3. `scp` the docker-compose to our Google Compute Engine VM
4. SSH into our Google Compute Engine VM
5. Pull both docker images for core and client
6. Run `docker compose` and our site will be live with the new changes

Our VM IP will be connected to our domain `ladaland.com` within the next day or two to ensure there is a user friendly point of access to LADA Land for all.