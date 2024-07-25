export function formatTime(totalSeconds) {
   const SEC_IN_HR = 3600;

   let timeStr = [
      `${Math.floor((totalSeconds % (SEC_IN_HR * 24)) / SEC_IN_HR)}`,
      `${Math.floor((totalSeconds % SEC_IN_HR) / 60)}`,
      `${Math.floor(totalSeconds % 60)}`,
   ];

   return timeStr.map((s) => s.padStart(2, "0")).join(":");
}
