
const QUESTIONS = [
  { q: 'Which HTML tag creates the largest heading?', a: '<h1>', o: ['<h6>', '<head>', '<header>'] },
  { q: 'What does CSS stand for?', a: 'Cascading Style Sheets', o: ['Creative Style System', 'Computer Style Sheets', 'Colorful Style Syntax'] },
  { q: 'Which CSS property changes the text color?', a: 'color', o: ['font-color', 'text-style', 'foreground'] },
  { q: 'Which Tailwind class applies padding of 1rem on all sides?', a: 'p-4', o: ['m-4', 'pad-4', 'px-16'] },
  { q: 'Which Tailwind class turns an element into a flex container?', a: 'flex', o: ['d-flex', 'display-flex', 'flexbox'] },
  { q: 'Which keyword declares a variable that can be reassigned later?', a: 'let', o: ['const', 'fixed', 'def'] },
  { q: 'Which method finds an element by its id?', a: 'document.getElementById()', o: ['document.findId()', 'document.getElement()', 'document.selectId()'] },
  { q: 'What does typeof [] return in JavaScript?', a: '"object"', o: ['"array"', '"list"', '"undefined"'] }
];

const app = document.getElementById('app');
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');


const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

let order, idx, score, missed;

function start(){
  order = shuffle(QUESTIONS);
  idx = 0;
  score = 0;
  missed = [];
  showIntro();
}

function showIntro(){
  app.innerHTML = `
    <h1 class="text-5xl font-extrabold leading-tight tracking-tight">Web Dev Quiz</h1>
    <p class="mt-3 text-lg" style="color:var(--muted)">${QUESTIONS.length} questions on HTML, CSS, Tailwind and JavaScript. Pick an answer to see right away if you got it.</p>
    <button id="go" class="btn mt-8 rounded-xl px-8 py-4 text-lg font-semibold">Start quiz</button>`;
  document.getElementById('go').onclick = showQuestion;
}

function showQuestion(){
  const item = order[idx];
  const opts = shuffle([item.a, ...item.o]);
  const pct = (idx / order.length) * 100;
  app.innerHTML = `
    <div class="flex items-center justify-between text-sm font-semibold" style="color:var(--muted)">
      <span>Question ${idx + 1} of ${order.length}</span><span>Score: ${score}</span>
    </div>
    <div class="mt-2 h-2 overflow-hidden rounded-full" style="background:var(--line)" role="progressbar" aria-valuenow="${idx}" aria-valuemax="${order.length}">
      <div class="h-full rounded-full" style="width:${pct}%;background:var(--accent);transition:width .3s"></div>
    </div>
    <h2 class="mt-8 text-2xl font-bold leading-snug">${esc(item.q)}</h2>
    <div id="opts" class="mt-6 space-y-3">
      ${opts.map(o => `<button class="opt w-full rounded-xl px-4 py-4 text-left font-semibold" data-v="${esc(o).replace(/"/g,'&quot;')}"><code>${esc(o)}</code></button>`).join('')}
    </div>
    <div id="fb" class="mt-5 min-h-[3.5rem]"></div>`;
  document.querySelectorAll('.opt').forEach(b => b.onclick = () => pick(b, item));
}

function pick(btn, item){
  const chosen = btn.dataset.v;
  const right = chosen === item.a;

  document.querySelectorAll('.opt').forEach(b => {
    b.disabled = true;
    if (b.dataset.v === item.a) b.classList.add('ok');
  });

  if (right) {
    score++;
  } else {
    btn.classList.add('bad');
    missed.push({ q: item.q, you: chosen, a: item.a });
  }

  const last = idx === order.length - 1;
  document.getElementById('fb').innerHTML = `
    <div class="flex items-center justify-between gap-3">
      <p class="font-semibold" style="color:${right ? 'var(--ok)' : 'var(--bad)'}">${right ? 'Correct!' : 'Not quite. The answer is highlighted.'}</p>
      <button id="next" class="btn rounded-xl px-6 py-3 font-semibold">${last ? 'See result' : 'Next question'}</button>
    </div>`;
  const next = document.getElementById('next');
  next.focus();
  next.onclick = () => { idx++; last ? showResult() : showQuestion(); };
}

function showResult(){
  const pct = Math.round(score / order.length * 100);
  const msg = pct === 100
    ? 'Perfect score. Nothing missed.'
    : pct >= 60
      ? 'Good work. A little more practice and you’re there.'
      : 'Keep practicing. Review the answers below.';

  app.innerHTML = `
    <p class="text-lg font-semibold" style="color:var(--muted)">Your result</p>
    <h1 class="mt-1 text-6xl font-extrabold tracking-tight">${score} / ${order.length}</h1>
    <p class="mt-3 text-lg">${msg}</p>
    ${missed.length ? `<h2 class="mt-8 text-xl font-bold">Questions you missed</h2>
      <ul class="mt-3 space-y-3">${missed.map(m => `
        <li class="card rounded-xl p-4">
          <p class="font-semibold">${esc(m.q)}</p>
          <p class="mt-2 text-sm" style="color:var(--bad)">Your answer: <code>${esc(m.you)}</code></p>
          <p class="text-sm" style="color:var(--ok)">Correct answer: <code>${esc(m.a)}</code></p>
        </li>`).join('')}</ul>` : ''}
    <button id="again" class="btn mt-8 rounded-xl px-8 py-4 text-lg font-semibold">Play again</button>`;
  document.getElementById('again').onclick = start;
}

start();