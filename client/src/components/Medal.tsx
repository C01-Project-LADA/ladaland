import React from 'react';

export default function Medal({
  placement,
}: {
  placement: 'gold' | 'silver' | 'bronze';
}) {
  const primaryColor =
    placement === 'gold'
      ? 'rgb(199, 180, 1)'
      : placement === 'silver'
        ? 'rgb(139, 139, 139)'
        : 'rgb(166, 100, 0)';

  return (
    <div className="scale-[0.8]">
      <div
        className="rounded-full w-7 h-7 border-2 flex items-center justify-center text-sm font-bold"
        style={{
          background:
            // linear gradient for the medal
            placement === 'gold'
              ? 'linear-gradient(145deg,rgb(255, 220, 114),rgb(255, 246, 198))'
              : placement === 'silver'
                ? 'linear-gradient(145deg,rgb(243, 243, 243), #C0C0C0)'
                : 'linear-gradient(145deg,rgb(234, 178, 121),rgb(249, 231, 214))',
          color:
            placement === 'gold'
              ? 'rgb(207, 138, 0)'
              : placement === 'silver'
                ? 'black'
                : primaryColor,
          borderColor: primaryColor,
          zIndex: 5,
        }}
      >
        {
          // switch statement for the medal
          placement === 'gold' ? '1' : placement === 'silver' ? '2' : '3'
        }
      </div>
      <div
        className="flex gap-1 relative"
        style={{ marginTop: '-12px', marginLeft: '2px', zIndex: 3 }}
      >
        <div
          className="w-0 h-0"
          style={{
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderLeft: `10px solid ${primaryColor}`,
            marginTop: '2px',
          }}
        />

        <div
          className="w-0 h-0"
          style={{
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderRight: `10px solid ${primaryColor}`,
            marginTop: '2px',
          }}
        />
      </div>
    </div>
  );
}
