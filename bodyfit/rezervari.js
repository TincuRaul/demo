// Datele comune pentru pagina de programare și panoul de admin (demo: totul stă în browser, în localStorage).
// Programul, duratele și numărul de aparate sunt DE EXEMPLU, de confirmat cu Body Fit.
window.BFR = (() => {
  // prețurile din lista lor „Bodyfit ems, Lista tarife” (story din 26.10.2026); duratele sunt de exemplu
  const SERVICII = {
    ems:   { nume: "EMS cu costum", scurt: "EMS", durata: 30, minute: "20 de minute de antrenament", pret: "60 lei", culoare: "#3fe0a5", aparate: ["EMS"] },
    prima: { nume: "Prima ședință EMS", scurt: "EMS, prima", durata: 30, minute: "te obișnuiești cu impulsul, cu antrenorul lângă tine", pret: "gratuită", culoare: "#3fe0a5", aparate: ["EMS"] },
    vac:   { nume: "Vacuum", scurt: "Vacuum", durata: 30, minute: "capsula cu vid și infraroșu", pret: "50 lei", culoare: "#ff5a5a", aparate: ["Vacuum"] },
    roll:  { nume: "Body Roll", scurt: "Body Roll", durata: 30, minute: "masaj cu role", pret: "35 lei", culoare: "#9a7cf4", aparate: ["Body Roll 1", "Body Roll 2"] },
    masaj: { nume: "Masaj anticelulitic", scurt: "Masaj", durata: 30, minute: "masaj manual", pret: "40 lei", culoare: "#f07fb7", aparate: ["Masaj"] },
    trepte:{ nume: "Trepte", scurt: "Trepte", durata: 30, minute: "aparatul cu trepte", pret: "45 lei", culoare: "#5b7cff", aparate: ["Trepte"] }
  };
  const APARATE = ["EMS", "Vacuum", "Body Roll 1", "Body Roll 2", "Masaj", "Trepte"];
  // program de exemplu: 0 = duminică
  const PROGRAM = { 1: ["08:00", "20:00"], 2: ["08:00", "20:00"], 3: ["08:00", "20:00"], 4: ["08:00", "20:00"], 5: ["08:00", "20:00"], 6: ["09:00", "13:00"], 0: null };
  const ZILE = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
  const LUNI = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];
  const KEY = "bf-demo-programari-v4";

  const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const azi = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const adauga = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const min = h => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
  const ora = m => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
  const sloturi = d => { const p = PROGRAM[d.getDay()]; if (!p) return []; const out = []; for (let m = min(p[0]); m + 30 <= min(p[1]); m += 30) out.push(ora(m)); return out; };
  const frumos = d => ZILE[d.getDay()] + ", " + d.getDate() + " " + LUNI[d.getMonth()];

  const CLIENTE = [
    ["Andreea Mureșan", "0741 xxx 218", "8 Ems, 400 lei", 8, 5], ["Ioana Pop", "0752 xxx 904", "4 Ems, 200 lei", 4, 1], ["Emese Kovács", "0745 xxx 377", "8 Ems + 8 body roll + 2 M", 18, 11],
    ["Mihaela Sabău", "0726 xxx 640", "10 Vacuum + 10 body roll", 20, 14], ["Cristina Bălaj", "0758 xxx 115", "Ședință cu ședință", 0, 0], ["Orsolya Fazakas", "0744 xxx 582", "8 Ems + 4 M + 4 body roll", 16, 9],
    ["Diana Rus", "0733 xxx 029", "12 ems, 550 lei", 12, 7], ["Raluca Vaida", "0762 xxx 451", "12 body roll, 300 lei", 12, 10], ["Bianca Chiș", "0749 xxx 806", "8 Trepte + 8 body roll", 16, 13],
    ["Larisa Horvath", "0721 xxx 334", "8 Masaj anticelulitic", 8, 2], ["Gabriela Nagy", "0755 xxx 793", "10 Ems + 10 Vacuum", 20, 15], ["Alexandra Toma", "0740 xxx 168", "Prima ședință EMS", 0, 0]
  ].map(([nume, tel, abon, total, ramase], i) => ({ nume, tel, abon, total, ramase,
    vizite: [23, 6, 41, 14, 3, 30, 9, 17, 5, 12, 26, 0][i], ultima: [2, 9, 1, 5, 34, 3, 12, 6, 21, 4, 2, null][i], din: ["martie 2025", "septembrie 2026", "ianuarie 2025", "mai 2026", "iunie 2026", "noiembrie 2024", "august 2026", "aprilie 2026", "octombrie 2026", "iulie 2026", "februarie 2026", "noiembrie 2026"][i] }));

  function seed() {
    // panoul pornește aproape gol: doar 3 programări azi, după ora curentă, ca să se vadă clar cele noi venite de pe site
    const z = azi(), s = sloturi(z), m = new Date().getHours() * 60 + new Date().getMinutes();
    const viitoare = s.filter(o => min(o) > m + 30), ore = viitoare.length >= 3 ? [viitoare[0], viitoare[Math.floor(viitoare.length / 2)], viitoare[viitoare.length - 1]] : viitoare;
    const ex = [["ems", "EMS", CLIENTE[0]], ["vac", "Vacuum", CLIENTE[3]], ["roll", "Body Roll 1", CLIENTE[5]]];
    return ore.map((o, i) => ({ id: i + 1, zi: iso(z), ora: o, serviciu: ex[i][0], aparat: ex[i][1], nume: ex[i][2].nume, tel: ex[i][2].tel, stare: "confirmat", sursa: i === 1 ? "site" : "telefon", nota: "" }));
  }
  function citeste() { try { const v = JSON.parse(localStorage.getItem(KEY)); if (v && v.ziua === iso(azi())) return v.lista; } catch (e) {} const l = seed(); salveaza(l); return l; }
  function salveaza(lista) { try { localStorage.setItem(KEY, JSON.stringify({ ziua: iso(azi()), lista })); } catch (e) {} }
  function liber(lista, zi, oraS, srv) { return SERVICII[srv].aparate.find(a => !lista.some(b => b.zi === zi && b.ora === oraS && b.aparat === a && b.stare !== "anulat")) || null; }
  function adaugaProgramare(p) { const l = citeste(); const aparat = liber(l, p.zi, p.ora, p.serviciu); if (!aparat) return null; const n = { id: Date.now(), stare: "confirmat", nota: "", ...p, aparat }; l.push(n); salveaza(l); return n; }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} }
  return { SERVICII, APARATE, PROGRAM, ZILE, LUNI, CLIENTE, KEY, iso, azi, adauga, min, ora, sloturi, frumos, citeste, salveaza, liber, adaugaProgramare, reset };
})();
