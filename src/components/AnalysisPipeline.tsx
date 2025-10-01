import type { PipelineStep } from "../types";

interface AnalysisPipelineProps {
  steps: PipelineStep[];
  currentStep?: number;
}

export function AnalysisPipeline({
  steps,
  currentStep = 0,
}: AnalysisPipelineProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Proceso de Análisis
      </h3>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                isActive
                  ? "border-blue-300 bg-blue-50"
                  : isCompleted
                  ? "border-green-300 bg-green-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isCompleted
                    ? "bg-green-600 text-white"
                    : "bg-slate-300 text-slate-600"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              <div className="flex-1">
                <h4
                  className={`font-medium ${
                    isActive
                      ? "text-blue-900"
                      : isCompleted
                      ? "text-green-900"
                      : "text-slate-600"
                  }`}
                >
                  {step.step
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </h4>
                <p
                  className={`text-sm ${
                    isActive
                      ? "text-blue-700"
                      : isCompleted
                      ? "text-green-700"
                      : "text-slate-500"
                  }`}
                >
                  {step.description}
                </p>
                {step.result && (
                  <p className="text-xs text-slate-600 mt-1 italic">
                    {step.result}
                  </p>
                )}
              </div>

              {isActive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 font-medium">
                    Procesando...
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
