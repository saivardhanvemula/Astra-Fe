import type { WorkoutDay as WorkoutDayType, WorkoutExerciseDisplay } from "@/types";

/** WorkoutDay can render either an admin plan day (exercises with exercise_id)
 *  or a member's current workout day (exercises with name + muscle_group). */
interface DisplayDay {
  day_number: number;
  title: string;
  exercises: (WorkoutExerciseDisplay | { exercise_id: string; sets: number; reps: string })[];
}

interface Props {
  day: WorkoutDayType | DisplayDay;
  isActive?: boolean;
}

export default function WorkoutDay({ day, isActive = false }: Props) {
  return (
    <div
      className={`border p-5 transition-colors duration-200 ${
        isActive
          ? "bg-[#1A0A0A] border-[#E50914]"
          : "bg-[#111111] border-[#2A2A2A]"
      }`}
    >
      {/* Day header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-8 h-8 flex items-center justify-center text-[10px] font-black shrink-0 ${
            isActive ? "bg-[#E50914] text-white" : "bg-[#1A1A1A] text-[#555]"
          }`}
        >
          {day.day_number}
        </div>
        <div>
          <p
            className={`text-[10px] font-black tracking-[0.2em] uppercase ${
              isActive ? "text-[#E50914]" : "text-[#555]"
            }`}
          >
            Day {day.day_number}
          </p>
          <p className="text-white font-black text-sm">{day.title}</p>
        </div>
        {isActive && (
          <span className="ml-auto text-[#E50914] text-[9px] font-black tracking-[0.2em] uppercase border border-[#E50914]/40 px-2 py-1">
            Today
          </span>
        )}
      </div>

      {/* Exercises */}
      <div className="space-y-2">
        {day.exercises.map((ex, i) => {
          const asAny = ex as Record<string, unknown>;
          const label =
            typeof asAny.name === "string"
              ? asAny.name
              : (asAny.exercise as { name?: string } | undefined)?.name ??
                (asAny.exercise_id as string);
          const sub =
            typeof asAny.muscle_group === "string"
              ? asAny.muscle_group
              : (asAny.exercise as { muscle_group?: string } | undefined)
                  ?.muscle_group ?? null;
          return (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0"
            >
              <div>
                <p className="text-white text-sm font-black">{label}</p>
                {sub && (
                  <p className="text-[#555] text-[9px] font-black tracking-[0.1em] uppercase mt-0.5">
                    {sub}
                  </p>
                )}
              </div>
              <p className="text-[#555] text-[10px] font-black tracking-[0.15em] uppercase shrink-0 ml-4">
                {ex.sets} × {ex.reps}
              </p>
            </div>
          );
        })}
        {day.exercises.length === 0 && (
          <p className="text-[#333] text-[10px] font-black tracking-[0.15em] uppercase py-1">
            No exercises
          </p>
        )}
      </div>
    </div>
  );
}
