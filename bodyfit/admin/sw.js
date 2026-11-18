// rulează în fundal pe telefonul patroanei: arată notificarea când vine o programare nouă
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", e => {
  let d = {}; try { d = e.data.json(); } catch { d = { title: "Programare nouă", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Programare nouă de pe site", {
    body: d.body || "", icon: "icon-192.png", badge: "icon-192.png", tag: d.tag || "programare", data: { url: d.url || "./" }, vibrate: [120, 60, 120]
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(ws => {
    const w = ws.find(x => x.url.includes("/bodyfit/admin/")); if (w) return w.focus(); return self.clients.openWindow(e.notification.data.url || "./");
  }));
});
