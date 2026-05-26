import { useEffect, useState } from 'react';
import { verifyApi, moviesApi, seriesApi } from '@/api';
import { useWatchlistStore } from '@/store/watchlist.store';

const STATES = {
  LOADING: 'loading',
  QUIZ: 'quiz',
  RESULT: 'result',
};

export default function VerifyModal({ movie, roomId, onClose }) {
  const [state, setState] = useState(STATES.LOADING);
  const [quizData, setQuizData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const markVerified = useWatchlistStore((s) => s.markVerified);

  function friendlyError(message) {
    if (
      /GEMINI_API_KEY|quota|billing|insufficient|credit/i.test(
        String(message || '')
      )
    ) {
      return 'AI quiz generation is unavailable right now. A fallback quiz will be used instead.';
    }

    return message || 'Something went wrong.';
  }

  // Generate quiz on mount
  useEffect(() => {
    async function generateQuiz() {
      try {
        const res = await verifyApi.generate({
          tmdb_id: movie.tmdb_id,
          title: movie.title,
          year: movie.release_year,
        });

        setQuizData(res.data);
        setState(STATES.QUIZ);
      } catch (e) {
        setError(
          friendlyError(e.response?.data?.error || e.message)
        );
      }
    }

    generateQuiz();
  }, [movie.tmdb_id, movie.title, movie.release_year]);

  async function handleSelect(idx) {
    if (selected !== null) return;

    setSelected(idx);

    const newAnswers = [...answers, idx];
    const isLast = current === quizData.questions.length - 1;

    await new Promise((r) => setTimeout(r, 700));

    if (isLast) {
      try {
        // ensure runtime_min is present; fetch from API if missing
        let runtimeMin = movie.runtime_min;
        if (!runtimeMin) {
          try {
            const detailRes = await moviesApi.getDetail(movie.tmdb_id);
            runtimeMin = detailRes.data?.runtime || detailRes.data?.episode_run_time?.[0] || 0;
          } catch (err) {
            try {
              const tvRes = await seriesApi.getDetail(movie.tmdb_id);
              runtimeMin = tvRes.data?.episode_run_time?.[0] || 0;
            } catch (err2) {
              runtimeMin = 0;
            }
          }
        }

        const res = await verifyApi.submit({
          quiz_id: quizData.quiz_id,
          answers: newAnswers,
          tmdb_id: movie.tmdb_id,
          title: movie.title,
          poster_path: movie.poster_path,
          runtime_min: runtimeMin,
          room_id: roomId || null,
          season_number: movie.season_number ?? null,
          media_type: movie.media_type || 'movie',
        });

        if (res.data.passed) {
          markVerified(movie.tmdb_id, movie.season_number ?? null);
        }

        setResult(res.data);
        setState(STATES.RESULT);
      } catch (e) {
        setError(
          friendlyError(e.response?.data?.error || e.message)
        );
      }
    } else {
      setAnswers(newAnswers);
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  const q = quizData?.questions?.[current];
  const total = quizData?.questions?.length || 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto min-h-[100dvh]">
      <div className="glass-strong rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-modal animate-scale-in max-h-[calc(100dvh-2rem)] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-text-primary">
            Verify your watch
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Movie strip */}
        <div className="flex items-center gap-3 bg-surface-raised rounded-xl p-3.5 mb-6 border border-surface-border">
          <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-brand">
              <rect x="2" y="2" width="20" height="20" rx="3" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {movie.title}
            </p>

            <p className="text-xs text-text-muted">
              {movie.release_year}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center mb-4 animate-fade-in">
            {error}
          </div>
        )}

        {/* Loading */}
        {state === STATES.LOADING && !error && (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-text-muted text-sm">
            <div className="w-8 h-8 border-2 border-surface-border border-t-brand rounded-full animate-spin" />
            <span>Generating questions with AI...</span>
          </div>
        )}

        {/* Quiz */}
        {state === STATES.QUIZ && q && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between text-xs text-text-muted mb-4">
              <span>
                Question {current + 1} of {total}
              </span>

              <div className="flex gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < current
                        ? 'bg-brand'
                        : i === current
                        ? 'bg-brand/50 ring-2 ring-brand/20'
                        : 'bg-surface-subtle'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm font-medium text-text-primary mb-5 leading-relaxed">
              {q.question}
            </p>

            <div className="space-y-2.5">
              {q.options.map((opt, i) => {
                let cls =
                  'w-full text-left text-sm px-4 py-3.5 rounded-xl border transition-all duration-200 ';

                if (selected === null) {
                  cls +=
                    'border-surface-border text-text-secondary hover:border-brand/40 hover:bg-brand/5 hover:text-text-primary cursor-pointer active:scale-[0.98]';
                } else if (i === selected) {
                  cls +=
                    'border-brand bg-brand/10 text-brand font-medium cursor-default shadow-glow';
                } else {
                  cls +=
                    'border-surface-border/50 text-text-muted/50 cursor-default';
                }

                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleSelect(i)}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium shrink-0 transition-all ${
                        i === selected
                          ? 'border-brand bg-brand text-white'
                          : 'border-surface-subtle text-text-muted'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Result */}
        {state === STATES.RESULT && result && (
          <div className="text-center py-6 animate-scale-in">
            <div className="text-5xl mb-4">
              {result.passed ? '🎉' : '❌'}
            </div>

            <h3 className="font-bold text-lg text-text-primary mb-1">
              {result.passed
                ? 'Watch verified!'
                : 'Verification failed'}
            </h3>

            <p className="text-sm text-text-secondary mb-1">
              {result.correct} / {result.total} correct (
              {result.score}%)
            </p>

            <p className="text-xs text-text-muted mb-6">
              {result.passed
                ? 'Your watch has been counted on the leaderboard.'
                : 'Try again after watching the full movie.'}
            </p>

            <button
              onClick={onClose}
              className="btn-primary max-w-[200px] mx-auto"
            >
              {result.passed ? 'Awesome!' : 'Got it'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}