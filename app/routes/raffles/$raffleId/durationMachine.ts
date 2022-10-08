import { formatDuration, intervalToDuration } from "date-fns";
import { createMachine, assign } from "xstate";

interface DurationContext {
  startDateTime: Date;
  timeUntilRaffle: string;
}

const durationMachine = createMachine<DurationContext>({
  initial: "running",
  predictableActionArguments: true,
  context: {
    startDateTime: new Date(),
    timeUntilRaffle: "",
  },
  states: {
    pending: {},
    running: {
      invoke: {
        src: () => (cb) => {
          const interval = setInterval(() => {
            cb("TICK");
          }, 1000);

          return () => {
            clearInterval(interval);
          };
        },
      },
      on: {
        TICK: {
          actions: assign({
            timeUntilRaffle: (context) =>
              formatDuration(
                intervalToDuration({
                  start: new Date(),
                  end: new Date(context.startDateTime),
                })
              ),
          }),
        },
      },
    },
  },
});

export default durationMachine;
