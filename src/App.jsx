import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════
const DEFAULT_STAFF = [
  { id: "admin1", name: "Patron", pin: "0000", role: "admin", color: "#e74c3c", active: true },
  { id: "srv1", name: "Amadou", pin: "1234", role: "serveur", color: "#e67e22", active: true },
  { id: "srv2", name: "Fatou", pin: "2345", role: "serveur", color: "#9b59b6", active: true },
  { id: "srv3", name: "Ibrahima", pin: "3456", role: "serveur", color: "#27ae60", active: true },
  { id: "kitch1", name: "Chef Omar", pin: "5678", role: "cuisine", color: "#e74c3c", active: true },
  { id: "kitch2", name: "Moussa", pin: "6789", role: "cuisine", color: "#3498db", active: true },
];

const DEFAULT_FAMILIES = [
  { id: "fam_entrees", name: "Entrées", icon: "🥗", sendToKitchen: true, color: "#e67e22" },
  { id: "fam_salades", name: "Salades", icon: "🥙", sendToKitchen: true, color: "#27ae60" },
  { id: "fam_thiep", name: "Thiep & Riz", icon: "🍚", sendToKitchen: true, color: "#e74c3c" },
  { id: "fam_mafe", name: "Mafé & Sauces", icon: "🫕", sendToKitchen: true, color: "#c0392b" },
  { id: "fam_yassa", name: "Yassa & Poissons", icon: "🐟", sendToKitchen: true, color: "#2980b9" },
  { id: "fam_grillades", name: "Grillades", icon: "🔥", sendToKitchen: true, color: "#d35400" },
  { id: "fam_centre", name: "Spécialités Centre", icon: "⭐", sendToKitchen: true, color: "#8e44ad" },
  { id: "fam_voyages", name: "Voyages Culinaires", icon: "✈️", sendToKitchen: true, color: "#16a085" },
  { id: "fam_desserts", name: "Desserts", icon: "🍮", sendToKitchen: true, color: "#f39c12" },
  { id: "fam_cocktails", name: "Cocktails Signature", icon: "🍹", sendToKitchen: false, color: "#1abc9c" },
  { id: "fam_vins", name: "Vins & Bouteilles", icon: "🍷", sendToKitchen: false, color: "#922b21" },
  { id: "fam_bieres", name: "Bières", icon: "🍺", sendToKitchen: false, color: "#d4ac0d" },
  { id: "fam_softs", name: "Softs & Eaux", icon: "💧", sendToKitchen: false, color: "#5dade2" },
  { id: "fam_chauds", name: "Boissons Chaudes", icon: "☕", sendToKitchen: false, color: "#a04000" },
  { id: "fam_alcools", name: "Whiskys & Spirits", icon: "🥃", sendToKitchen: false, color: "#784212" },
  { id: "fam_garnitures", name: "Garnitures", icon: "🍟", sendToKitchen: true, color: "#7f8c8d" },
];

const DEFAULT_MENU = [
  { id: "e1", familyId: "fam_entrees", name: "Pastels", price: 6, desc: "Pastels fourrés au thon ou viande hachée", stock: null },
  { id: "e2", familyId: "fam_entrees", name: "Nems", price: 6, desc: "Nems croustillants poulet ou crevettes", stock: null },
  { id: "e3", familyId: "fam_entrees", name: "Oeuf Mayo", price: 6, desc: "Oeuf mayo à la sénégalaise", stock: null },
  { id: "e4", familyId: "fam_entrees", name: "Filet de Hareng", price: 6, desc: "Filet de hareng mariné", stock: null },
  { id: "s1", familyId: "fam_salades", name: "Daakaroise Signature", price: 18, desc: "Fruits de saison, saumon frais, avocat", stock: null },
  { id: "s2", familyId: "fam_salades", name: "Burrata", price: 17, desc: "Roquette, burrata, tomate", stock: null },
  { id: "s3", familyId: "fam_salades", name: "César", price: 18, desc: "Laitue, poulet grillé, parmesan, sauce cesar", stock: null },
  { id: "s4", familyId: "fam_salades", name: "Océan", price: 16, desc: "Thon, laitue, tomate, concombre, oignons rouges", stock: null },
  { id: "p1", familyId: "fam_thiep", name: "Thiep Poisson", price: 20, desc: "Riz sauce rouge, poisson, légumes", stock: null },
  { id: "p2", familyId: "fam_thiep", name: "Thiep Poulet", price: 15, desc: "Riz sauce rouge, poulet, légumes", stock: null },
  { id: "p3", familyId: "fam_mafe", name: "Mafé Viande", price: 15, desc: "Sauce arachide, boeuf, légumes, riz blanc", stock: null },
  { id: "p4", familyId: "fam_mafe", name: "Mafé Poulet", price: 15, desc: "Sauce arachide, poulet, légumes, riz blanc", stock: null },
  { id: "p7", familyId: "fam_mafe", name: "Soupe Kandja/Gombo", price: 18, desc: "Sauce gombo, poisson, viande, fruits de mer", stock: null },
  { id: "p5", familyId: "fam_yassa", name: "Yassa Poisson", price: 20, desc: "Poisson frit, sauce oignons, riz blanc", stock: null },
  { id: "p6", familyId: "fam_yassa", name: "Yassa Poulet", price: 15, desc: "Poulet, sauce oignons et olives, riz blanc", stock: null },
  { id: "g1", familyId: "fam_grillades", name: "Dorade Braisée", price: 25, desc: "Dorade braisée, sauce maison", stock: null },
  { id: "g2", familyId: "fam_grillades", name: "Bar Braisé", price: 25, desc: "Bar braisé, sauce maison", stock: null },
  { id: "g3", familyId: "fam_grillades", name: "Capitaine Braisé", price: 30, desc: "Capitaine braisé, sauce maison", stock: null },
  { id: "g4", familyId: "fam_grillades", name: "Malangwa Braisé", price: 25, desc: "Malangwa braisé, sauce maison", stock: null },
  { id: "g5", familyId: "fam_grillades", name: "Gambas", price: 25, desc: "Gambas entières grillées", stock: null },
  { id: "g6", familyId: "fam_grillades", name: "Dibi", price: 23, desc: "Côtes d'agneau au feu de bois", stock: null },
  { id: "g7", familyId: "fam_grillades", name: "Brochettes Boeuf", price: 16, desc: "Brochettes de boeuf & salade", stock: null },
  { id: "g8", familyId: "fam_grillades", name: "Souris d'Agneau", price: 25, desc: "Souris d'agneau & purée maison", stock: null },
  { id: "g9", familyId: "fam_grillades", name: "Choukouya", price: 25, desc: "Agneau grillé", stock: null },
  { id: "g10", familyId: "fam_grillades", name: "Pièce du Boucher", price: 25, desc: "Entrecôte sauce bleu", stock: null },
  { id: "g11", familyId: "fam_grillades", name: "Brochettes Poulet", price: 14, desc: "Brochettes de poulet", stock: null },
  { id: "g12", familyId: "fam_grillades", name: "½ Poulet Braisé", price: 18, desc: "Poulet braisé, sauce maison", stock: null },
  { id: "g13", familyId: "fam_grillades", name: "Ailes de Poulet", price: 15, desc: "Ailes marinées, sauce maison", stock: null },
  { id: "g14", familyId: "fam_grillades", name: "Pintade", price: 18, desc: "Pintade au feu de bois", stock: null },
  { id: "g15", familyId: "fam_grillades", name: "Mix Grill Daakar", price: 100, desc: "Assortiment Dibi, Brochettes, Poulet, Gambas", stock: null },
  { id: "c1", familyId: "fam_centre", name: "Madessu/Haricots", price: 15, desc: "Haricots, viande, sauce tomates africaine", stock: null },
  { id: "c2", familyId: "fam_centre", name: "Makayabou/Morue", price: 25, desc: "Morue salée, oignons, épices", stock: null },
  { id: "c3", familyId: "fam_centre", name: "Ndolé Royal", price: 23, desc: "Feuilles ndolé, arachide, viande fumée, crevettes", stock: null },
  { id: "c4", familyId: "fam_centre", name: "Poulet DG", price: 15, desc: "Poulet mijoté, plantains, légumes", stock: null },
  { id: "c5", familyId: "fam_centre", name: "Poulet Mayo", price: 18, desc: "Poulet braisé, sauce mayonnaise", stock: null },
  { id: "c6", familyId: "fam_centre", name: "Garba", price: 15, desc: "Thon frit, attiéké", stock: null },
  { id: "v1", familyId: "fam_voyages", name: "Foutou Banane Sauce Graine", price: 20, desc: "Purée banane plantain, sauce graine (merc.)", stock: null },
  { id: "v2", familyId: "fam_voyages", name: "Fumbwa/Coco", price: 20, desc: "Feuilles fumbwa, sauce arachide (jeudi)", stock: null },
  { id: "d1", familyId: "fam_desserts", name: "Thiackry", price: 5, desc: "Dessert sénégalais", stock: null },
  { id: "d2", familyId: "fam_desserts", name: "Tarte aux Pommes", price: 5, desc: "Tarte maison", stock: null },
  { id: "d3", familyId: "fam_desserts", name: "Mousse au Chocolat", price: 5, desc: "Mousse maison", stock: null },
  { id: "d4", familyId: "fam_desserts", name: "Crème Brûlée", price: 5, desc: "Crème brûlée maison", stock: null },
  { id: "d5", familyId: "fam_desserts", name: "Café Gourmand", price: 8, desc: "Café + mignardises", stock: null },
  { id: "b1", familyId: "fam_cocktails", name: "Bissap Maison", price: 5, desc: "Hibiscus, menthe fraîche", stock: null },
  { id: "b2", familyId: "fam_cocktails", name: "Bouye Frappé", price: 6, desc: "Baobab vanille", stock: null },
  { id: "b3", familyId: "fam_cocktails", name: "Gingembre Citron Vert", price: 6, desc: "Gingembre, citron vert", stock: null },
  { id: "b4", familyId: "fam_cocktails", name: "Cocktail Teranga", price: 11, desc: "Rhum, ananas, bissap", stock: null },
  { id: "b5", familyId: "fam_cocktails", name: "Pina Colada", price: 13, desc: "Cocktail classique", stock: null },
  { id: "b6", familyId: "fam_cocktails", name: "Mojito Fraise/Bissap", price: 11, desc: "Mojito signature", stock: null },
  { id: "b7", familyId: "fam_cocktails", name: "Sex on the Beach", price: 13, desc: "Cocktail classique", stock: null },
  { id: "b8", familyId: "fam_cocktails", name: "La Dakaroise", price: 11, desc: "Rhum, gingembre, citron", stock: null },
  { id: "w1", familyId: "fam_vins", name: "Vin Rouge Verre", price: 6, desc: "Sélection rouge", stock: null },
  { id: "w2", familyId: "fam_vins", name: "Vin Blanc Verre", price: 6, desc: "Sélection blanc", stock: null },
  { id: "w3", familyId: "fam_vins", name: "Rosé Verre", price: 6, desc: "Sélection rosé", stock: null },
  { id: "w4", familyId: "fam_vins", name: "Bordeaux", price: 25, desc: "Bouteille", stock: null },
  { id: "w5", familyId: "fam_vins", name: "Bourgogne Rouge", price: 30, desc: "Bouteille", stock: null },
  { id: "w6", familyId: "fam_vins", name: "Chardonnay", price: 25, desc: "Bouteille", stock: null },
  { id: "w7", familyId: "fam_vins", name: "Chablis", price: 30, desc: "Bouteille", stock: null },
  { id: "w8", familyId: "fam_vins", name: "Champagne Moët", price: 100, desc: "Bouteille", stock: null },
  { id: "w9", familyId: "fam_vins", name: "Dom Pérignon", price: 350, desc: "Bouteille prestige", stock: null },
  { id: "beer1", familyId: "fam_bieres", name: "Heineken Pression", price: 4.5, desc: "50cl pression", stock: null },
  { id: "beer2", familyId: "fam_bieres", name: "Leffe Pression", price: 4.5, desc: "50cl pression", stock: null },
  { id: "beer3", familyId: "fam_bieres", name: "Desperados 65cl", price: 10, desc: "Bouteille", stock: null },
  { id: "beer4", familyId: "fam_bieres", name: "Heineken 33cl", price: 5, desc: "Bouteille", stock: null },
  { id: "beer5", familyId: "fam_bieres", name: "Leffe 65cl", price: 10, desc: "Bouteille", stock: null },
  { id: "beer6", familyId: "fam_bieres", name: "Guinness 33cl", price: 6, desc: "Bouteille", stock: null },
  { id: "beer7", familyId: "fam_bieres", name: "1664 65cl", price: 7, desc: "Bouteille", stock: null },
  { id: "sf1", familyId: "fam_softs", name: "Coca/Fanta/Orangina", price: 5, desc: "33cl", stock: null },
  { id: "sf2", familyId: "fam_softs", name: "Schweppes/Sprite", price: 5, desc: "33cl", stock: null },
  { id: "sf3", familyId: "fam_softs", name: "Evian", price: 5, desc: "Eau plate 50cl", stock: null },
  { id: "sf4", familyId: "fam_softs", name: "Perrier", price: 5, desc: "Eau gazeuse", stock: null },
  { id: "sf5", familyId: "fam_softs", name: "San Pellegrino", price: 5, desc: "Eau gazeuse", stock: null },
  { id: "sf6", familyId: "fam_softs", name: "Top", price: 7, desc: "Top 33cl", stock: null },
  { id: "ch1", familyId: "fam_chauds", name: "Café", price: 2, desc: "Expresso", stock: null },
  { id: "ch2", familyId: "fam_chauds", name: "Thé", price: 5, desc: "Thé chaud", stock: null },
  { id: "ch3", familyId: "fam_chauds", name: "Grog", price: 8, desc: "Rhum citron chaud", stock: null },
  { id: "sp1", familyId: "fam_alcools", name: "Jack Daniels", price: 7, desc: "Verre", stock: null },
  { id: "sp2", familyId: "fam_alcools", name: "Black Label", price: 6, desc: "Verre", stock: null },
  { id: "sp3", familyId: "fam_alcools", name: "Chivas 12", price: 8, desc: "Verre", stock: null },
  { id: "sp4", familyId: "fam_alcools", name: "Chivas 18", price: 10, desc: "Verre", stock: null },
  { id: "sp5", familyId: "fam_alcools", name: "Hennessy", price: 10, desc: "Verre", stock: null },
  { id: "sp6", familyId: "fam_alcools", name: "Rhum Arrangé", price: 8, desc: "Verre", stock: null },
  { id: "sp7", familyId: "fam_alcools", name: "Pastis", price: 6, desc: "Verre", stock: null },
  { id: "sp8", familyId: "fam_alcools", name: "Kir au Cassis", price: 7, desc: "Verre", stock: null },
  { id: "sp9", familyId: "fam_alcools", name: "Coupe Champagne", price: 20, desc: "Verre", stock: null },
  { id: "ga1", familyId: "fam_garnitures", name: "Frites", price: 5, desc: "Garniture", stock: null },
  { id: "ga2", familyId: "fam_garnitures", name: "Riz Blanc", price: 5, desc: "Garniture", stock: null },
  { id: "ga3", familyId: "fam_garnitures", name: "Bananes Plantains", price: 5, desc: "Garniture", stock: null },
  { id: "ga4", familyId: "fam_garnitures", name: "Haricots Verts", price: 5, desc: "Garniture", stock: null },
  { id: "ga5", familyId: "fam_garnitures", name: "Frites Patates Douces", price: 6, desc: "Garniture", stock: null },
  { id: "ga6", familyId: "fam_garnitures", name: "Smoule", price: 3, desc: "Garniture", stock: null },
  { id: "ga7", familyId: "fam_garnitures", name: "Chikwanga", price: 3, desc: "Garniture", stock: null },
  { id: "ga8", familyId: "fam_garnitures", name: "Bananes Vapeur", price: 7, desc: "Garniture", stock: null },
];

const INITIAL_TABLES = Array.from({ length: 14 }, (_, i) => ({
  id: `t${i + 1}`, name: `Table ${i + 1}`, status: "libre",
  serverId: null, openedAt: null, orderId: null, covers: 0,
}));

// ═══════════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════════
const S = {
  get: (k, def = null) => { try { const v = localStorage.getItem(`dkr3_${k}`); return v !== null ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(`dkr3_${k}`, JSON.stringify(v)); window.dispatchEvent(new StorageEvent("storage", { key: `dkr3_${k}` })); } catch {} },
};

// ═══════════════════════════════════════════════════════════════════
// PRINT
// ═══════════════════════════════════════════════════════════════════
function printTicket(html) {
  const w = window.open("", "_blank", "width=420,height=640");
  if (!w) return;
  w.document.write(`<html><head><title>Ticket Le Daakar</title><style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Courier New',monospace;font-size:12px;width:300px;margin:0 auto;padding:12px;}
    h2{text-align:center;font-size:15px;padding-bottom:7px;margin-bottom:7px;border-bottom:2px dashed #000;}
    .c{text-align:center;margin:3px 0;} .line{border-top:1px dashed #000;margin:8px 0;}
    table{width:100%;border-collapse:collapse;} td{padding:3px 2px;vertical-align:top;}
    .r{text-align:right;} .b{font-weight:bold;} .lg{font-size:14px;font-weight:bold;}
    .small{font-size:10px;color:#555;} .big{font-size:16px;font-weight:bold;}
    @media print{body{margin:0;width:100%;}}
  </style></head><body>${html}
  <script>window.onload=function(){window.print();setTimeout(function(){window.close();},800);}<\/script>
  </body></html>`);
  w.document.close();
}

function htmlKitchen(ticket) {
  const t = new Date(ticket.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const rows = ticket.items.map(i =>
    `<tr><td class="b" style="width:28px">${i.qty}×</td><td>${i.name}${i.options?.cuisson ? `<br><span class="small">🔥 ${i.options.cuisson}</span>` : ""}${i.options?.accompagnement ? `<br><span class="small">🍽 Accomp. offert: ${i.options.accompagnement}</span>` : ""}${i.options?.sans?.length ? `<br><span class="small">⚠ Sans: ${i.options.sans.join(", ")}</span>` : ""}${i.options?.note ? `<br><span class="small">📝 ${i.options.note}</span>` : ""}</td></tr>`
  ).join("");
  return `<h2>${ticket.isComplement ? "➕ COMPLÉMENT CUISINE" : "🍽 BON DE CUISINE"}</h2>
<div class="c big">${ticket.tableName}</div>
<div class="c">Serveur: <b>${ticket.serverName}</b></div>
<div class="c">${t}</div>
${ticket.isComplement ? `<div class="c small" style="font-style:italic;border:1px solid #000;padding:3px;">⚠ COMPLÉMENT — articles supplémentaires</div>` : ""}
<div class="line"></div>
<table>${rows}</table>
${ticket.notes ? `<div class="line"></div><div class="small">📝 Note: ${ticket.notes}</div>` : ""}
<div class="line"></div>
<div class="c small">Le Daakar — 112 Rue Damrémont — Paris 18</div>`;
}

function htmlReady(ticket) {
  const t = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const rows = ticket.items.map(i => `<tr><td class="b" style="width:28px">${i.qty}×</td><td>${i.name}</td></tr>`).join("");
  return `<h2>✅ PRÊT À SERVIR</h2>
<div class="c big">${ticket.tableName}</div>
<div class="c">Serveur: <b>${ticket.serverName}</b></div>
<div class="c">${t}</div>
<div class="line"></div>
<table>${rows}</table>
<div class="line"></div>
<div class="c b" style="font-size:16px">⬆ SERVICE EN SALLE ⬆</div>`;
}

function htmlBill(table, order, menuItems, staffName) {
  const now = new Date().toLocaleString("fr-FR");
  const rows = order.items.map(i => {
    const mi = menuItems.find(m => m.id === i.menuId);
    if (!mi) return "";
    return `<tr><td>${i.qty}× ${mi.name}</td><td class="r">${(mi.price * i.qty).toFixed(2)}€</td></tr>`;
  }).join("");
  const ht = order.items.reduce((s, i) => { const mi = menuItems.find(m => m.id === i.menuId); return s + (mi ? mi.price * i.qty : 0); }, 0);
  const tva = ht * 0.1;
  return `<h2>🍽 LE DAAKAR</h2>
<div class="c">112 Rue Damrémont — Paris 18</div>
<div class="c">Tél: 0758 199 260</div>
<div class="line"></div>
<div><b>${table.name}</b>${table.covers ? ` — ${table.covers} couvert${table.covers > 1 ? "s" : ""}` : ""}</div>
<div>Serveur: ${staffName}</div>
<div>${now}</div>
<div class="line"></div>
<table>${rows}</table>
<div class="line"></div>
<table>
<tr><td>Total HT</td><td class="r">${ht.toFixed(2)}€</td></tr>
<tr><td>TVA 10%</td><td class="r">${tva.toFixed(2)}€</td></tr>
<tr><td class="big">TOTAL TTC</td><td class="r big">${(ht + tva).toFixed(2)}€</td></tr>
${order.payment ? `<tr><td>Paiement</td><td class="r">${order.payment}</td></tr>` : ""}
</table>
<div class="line"></div>
<div class="c">Merci de votre visite !</div>
<div class="c small">@ledaakarparis18</div>`;
}

function htmlSessionReport(member, sessionOrders, menuItems, clockIn, clockOut) {
  const paid = sessionOrders.filter(o => o.status === "paid");
  const total = paid.reduce((s, o) => s + o.items.reduce((ss, i) => { const mi = menuItems.find(m => m.id === i.menuId); return ss + (mi ? mi.price * i.qty : 0); }, 0) * 1.1, 0);
  const counts = {};
  paid.forEach(o => o.items.forEach(i => { const mi = menuItems.find(m => m.id === i.menuId); if (mi) counts[mi.name] = (counts[mi.name] || 0) + i.qty; }));
  const topItems = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([n, q], i) => `${i + 1}. ${n} × ${q}`).join("<br>");
  const dur = clockOut && clockIn ? Math.floor((clockOut - clockIn) / 60000) : null;
  const hi = dur ? Math.floor(dur / 60) : 0;
  const mi2 = dur ? dur % 60 : 0;
  const clockInStr = clockIn ? new Date(clockIn).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "--";
  const clockOutStr = clockOut ? new Date(clockOut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "--";
  return `<h2>📋 RAPPORT DE SERVICE</h2>
<div class="c b" style="font-size:14px">${member.name}</div>
<div class="c">${new Date().toLocaleDateString("fr-FR")}</div>
<div class="line"></div>
<table>
<tr><td>Arrivée</td><td class="r b">${clockInStr}</td></tr>
<tr><td>Départ</td><td class="r b">${clockOutStr}</td></tr>
${dur !== null ? `<tr><td>Durée service</td><td class="r">${hi}h${String(mi2).padStart(2, "0")}</td></tr>` : ""}
</table>
<div class="line"></div>
<table>
<tr><td>Commandes encaissées</td><td class="r b">${paid.length}</td></tr>
<tr><td class="big">Total encaissé TTC</td><td class="r big">${total.toFixed(2)}€</td></tr>
<tr><td>Ticket moyen</td><td class="r">${paid.length ? (total / paid.length).toFixed(2) : "0.00"}€</td></tr>
</table>
${topItems ? `<div class="line"></div><b>Top articles:</b><br>${topItems}` : ""}
<div class="line"></div>
<div class="c small">Le Daakar — Paris 18</div>`;
}

// ═══════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);

function AppProvider({ children }) {
  const [session, setSession] = useState(() => S.get("session"));
  const [staff, setStaffState] = useState(() => S.get("staff", DEFAULT_STAFF));
  const [families, setFamiliesState] = useState(() => {
    const loaded = S.get("families", DEFAULT_FAMILIES);
    return loaded.map(f => f.id === "fam_garnitures" ? { ...f, sendToKitchen: true } : f);
  });
  const [menuItems, setMenuItemsState] = useState(() => S.get("menu", DEFAULT_MENU));
  const [tables, setTablesState] = useState(() => S.get("tables", INITIAL_TABLES));
  const [orders, setOrdersState] = useState(() => S.get("orders", []));
  const [kitchenTickets, setKitchenState] = useState(() => S.get("kitchen", []));
  const [availability, setAvailState] = useState(() => S.get("avail", {}));
  const [clockLog, setClockState] = useState(() => S.get("clocklog", []));
  const [delivery, setDelivState] = useState(() => S.get("delivery", []));
  const [notifications, setNotifs] = useState([]);
  const [page, setPage] = useState("tables");

  // ── save helpers ──
  const sv = useCallback((key, setter, data) => { setter(data); S.set(key, data); }, []);
  const setStaff     = (d) => sv("staff",    setStaffState,    d);
  const setFamilies  = (d) => sv("families", setFamiliesState, d);
  const setMenuItems = (d) => sv("menu",     setMenuItemsState,d);
  const setTables    = (d) => sv("tables",   setTablesState,   d);
  const setOrders    = (d) => sv("orders",   setOrdersState,   d);
  const setKitchen   = (d) => sv("kitchen",  setKitchenState,  d);
  const setAvail     = (d) => sv("avail",    setAvailState,    d);
  const setClock     = (d) => sv("clocklog", setClockState,    d);
  const setDelivery  = (d) => sv("delivery", setDelivState,    d);

  // ── cross-tab sync ──
  useEffect(() => {
    const sync = () => {
      setStaffState(S.get("staff", DEFAULT_STAFF));
      setFamiliesState(S.get("families", DEFAULT_FAMILIES).map(f => f.id === "fam_garnitures" ? { ...f, sendToKitchen: true } : f));
      setMenuItemsState(S.get("menu", DEFAULT_MENU));
      setTablesState(S.get("tables", INITIAL_TABLES));
      setOrdersState(S.get("orders", []));
      setAvailState(S.get("avail", {}));
      setClockState(S.get("clocklog", []));
      setDelivState(S.get("delivery", []));
      const fresh = S.get("kitchen", []);
      setKitchenState(prev => {
        const prevIds = new Set(prev.map(t => t.id));
        fresh.filter(t => !prevIds.has(t.id)).forEach(t => pushNotif({ type: "kitchen_new", msg: `🔔 Nouveau bon: ${t.tableName}` }));
        // notify serveur when their ticket changes status
        const changed = fresh.filter(t => {
          const old = prev.find(p => p.id === t.id);
          return old && old.status !== t.status;
        });
        changed.forEach(t => {
          if (t.status === "preparing") pushNotif({ type: "preparing", msg: `🔥 En préparation: ${t.tableName}` });
          if (t.status === "ready") pushNotif({ type: "ready", msg: `✅ Prêt à servir: ${t.tableName}` });
        });
        return fresh;
      });
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const pushNotif = useCallback((notif) => {
    const n = { ...notif, id: `n_${Date.now()}_${Math.random()}`, ts: Date.now() };
    setNotifs(p => [n, ...p.slice(0, 24)]);
    setTimeout(() => setNotifs(p => p.filter(x => x.id !== n.id)), 7000);
  }, []);

  // ── AUTH ──
  const login = useCallback((member) => {
    setSession(member); S.set("session", member);
    const now = Date.now();
    const log = S.get("clocklog", []);
    const today = new Date().toDateString();
    if (!log.find(l => l.staffId === member.id && new Date(l.clockIn).toDateString() === today && !l.clockOut)) {
      setClock([...log, { id: `cl_${now}`, staffId: member.id, name: member.name, role: member.role, clockIn: now, clockOut: null }]);
    }
  }, []);

  const logout = useCallback((printReport = true) => {
    if (!session) return;
    const log = S.get("clocklog", []);
    const today = new Date().toDateString();
    const entry = log.find(l => l.staffId === session.id && new Date(l.clockIn).toDateString() === today && !l.clockOut);
    const now = Date.now();
    if (entry) {
      const updLog = log.map(l => l.id === entry.id ? { ...l, clockOut: now } : l);
      setClock(updLog);
      if (printReport && (session.role === "serveur" || session.role === "admin")) {
        const myOrds = S.get("orders", []).filter(o => o.serverId === session.id);
        const html = htmlSessionReport(session, myOrds, S.get("menu", DEFAULT_MENU), entry.clockIn, now);
        setTimeout(() => printTicket(html), 300);
      }
    }
    setSession(null); S.set("session", null);
  }, [session]);

  // ── TABLES ──
  const openTable = useCallback((tableId, covers = 2) => {
    const orderId = `ord_${Date.now()}`;
    const now = Date.now();
    const cur = S.get("tables", INITIAL_TABLES);
    setTables(cur.map(t => t.id === tableId ? { ...t, status: "en cours", serverId: session.id, openedAt: now, orderId, covers } : t));
    const newOrder = { id: orderId, tableId, serverId: session.id, serverName: session.name, items: [], status: "open", notes: "", createdAt: now, covers };
    setOrders([...S.get("orders", []), newOrder]);
    return orderId;
  }, [session]);

  const updateOrder = useCallback((orderId, updates) => {
    setOrders(S.get("orders", []).map(o => o.id === orderId ? { ...o, ...updates } : o));
  }, []);

  // ── Décrémente le stock des articles ayant un stock défini ──
  const decrementStock = useCallback((items) => {
    const curMenu = S.get("menu", DEFAULT_MENU);
    let changed = false;
    const newMenu = curMenu.map(mi => {
      if (mi.stock === null) return mi; // illimité → rien à faire
      const totalOrdered = items
        .filter(i => i.menuId === mi.id)
        .reduce((sum, i) => sum + i.qty, 0);
      if (totalOrdered === 0) return mi;
      changed = true;
      return { ...mi, stock: Math.max(0, mi.stock - totalOrdered) };
    });
    if (changed) {
      // persist directement (setMenuItems appelle S.set + trigger storage)
      setMenuItems(newMenu);
    }
  }, []);

  // ── Réincrémente le stock lors d'une annulation ──
  const incrementStock = useCallback((items) => {
    const curMenu = S.get("menu", DEFAULT_MENU);
    let changed = false;
    const newMenu = curMenu.map(mi => {
      if (mi.stock === null) return mi;
      const totalCancelled = items
        .filter(i => i.menuId === mi.id)
        .reduce((sum, i) => sum + i.qty, 0);
      if (totalCancelled === 0) return mi;
      changed = true;
      return { ...mi, stock: mi.stock + totalCancelled };
    });
    if (changed) setMenuItems(newMenu);
  }, []);

  const sendToKitchen = useCallback((orderId, tableName) => {
    const curOrders = S.get("orders", []);
    const order     = curOrders.find(o => o.id === orderId);
    if (!order) return false;

    const curMenu = S.get("menu",     DEFAULT_MENU);
    const curFams = S.get("families", DEFAULT_FAMILIES);

    // sentItems = { [menuId]: qty } — ce qui a déjà été envoyé en cuisine
    const alreadySent = order.sentItems || {};

    // Filtrer les articles qui vont en cuisine
    const kitItems = order.items
      .filter(item => {
        const mi  = curMenu.find(m => m.id === item.menuId);
        const fam = curFams.find(f => f.id === mi?.familyId);
        return fam?.sendToKitchen;
      })
      .map(item => {
        const mi          = curMenu.find(m => m.id === item.menuId);
        const qtySent     = alreadySent[item.menuId] || 0;
        const deltaQty    = item.qty - qtySent;       // complément à envoyer
        return deltaQty > 0
          ? { ...item, qty: deltaQty, name: mi?.name || "?" }
          : null;
      })
      .filter(Boolean); // ne garder que les articles avec un delta > 0

    // Rien de nouveau à envoyer
    if (!kitItems.length) return false;

    // Construire le ticket avec seulement les nouveaux articles / quantités
    const ticket = {
      id:         `kt_${Date.now()}`,
      orderId,
      tableId:    order.tableId,
      tableName,
      serverId:   order.serverId,
      serverName: order.serverName,
      items:      kitItems,
      status:     "pending",
      notes:      order.notes,
      createdAt:  Date.now(),
      isComplement: Object.keys(alreadySent).length > 0, // 2e envoi ou plus
    };

    setKitchen([...S.get("kitchen", []), ticket]);

    // Mettre à jour sentItems dans la commande — accumuler les quantités envoyées
    const updatedSentItems = { ...alreadySent };
    kitItems.forEach(i => {
      updatedSentItems[i.menuId] = (updatedSentItems[i.menuId] || 0) + i.qty;
    });
    setOrders(curOrders.map(o =>
      o.id === orderId
        ? { ...o, sentItems: updatedSentItems }
        : o
    ));

    setTables(S.get("tables", INITIAL_TABLES).map(t =>
      t.orderId === orderId ? { ...t, status: "envoyé cuisine" } : t
    ));

    // Décrémenter le stock sur les articles effectivement envoyés
    decrementStock(kitItems);

    printTicket(htmlKitchen(ticket));
    return true;
  }, [decrementStock]);

  const cancelKitchenItem = useCallback((ticketId, menuId) => {
    const cur = S.get("kitchen", []);
    const ticket = cur.find(t => t.id === ticketId);
    if (!ticket || ticket.status !== "pending") return false;
    const cancelledItems = ticket.items.filter(i => i.menuId === menuId);
    const newItems = ticket.items.filter(i => i.menuId !== menuId);
    setKitchen(newItems.length === 0 ? cur.filter(t => t.id !== ticketId) : cur.map(t => t.id === ticketId ? { ...t, items: newItems } : t));
    // ✅ Réincrémente le stock des articles annulés
    if (cancelledItems.length > 0) incrementStock(cancelledItems);
    pushNotif({ type: "cancel", msg: `✕ Annulation: ${ticket.tableName}` });
    return true;
  }, [incrementStock, pushNotif]);

  // ── KITCHEN TICKET ACTIONS ──
  // role=cuisine only actions: pending→preparing, preparing→ready, ready→served(delete)
  const updateTicket = useCallback((ticketId, status) => {
    const cur = S.get("kitchen", []);
    const ticket = cur.find(t => t.id === ticketId);
    if (!ticket) return;
    if (status === "served") {
      // Remove ticket from list entirely — "SERVI" button
      setKitchen(cur.filter(t => t.id !== ticketId));
      setTables(S.get("tables", INITIAL_TABLES).map(t => t.orderId === ticket.orderId ? { ...t, status: "servi" } : t));
      pushNotif({ type: "served", msg: `🍽 Servi: ${ticket.tableName}` });
      return;
    }
    setKitchen(cur.map(t => t.id === ticketId ? { ...t, status, updatedAt: Date.now() } : t));
    if (status === "ready") {
      setTables(S.get("tables", INITIAL_TABLES).map(t => t.orderId === ticket.orderId ? { ...t, status: "prêt" } : t));
      pushNotif({ type: "ready", msg: `✅ Prêt à servir: ${ticket.tableName}` });
      printTicket(htmlReady(ticket));
    }
    if (status === "preparing") {
      pushNotif({ type: "preparing", msg: `🔥 En préparation: ${ticket.tableName}` });
    }
  }, [pushNotif]);

  const closeTable = useCallback((tableId, paymentMethod) => {
    const curTables = S.get("tables", INITIAL_TABLES);
    const table = curTables.find(t => t.id === tableId);
    if (!table) return;
    const curOrders = S.get("orders", []);
    const order = curOrders.find(o => o.id === table.orderId);
    if (order) printTicket(htmlBill(table, { ...order, payment: paymentMethod }, S.get("menu", DEFAULT_MENU), session?.name || ""));
    setOrders(curOrders.map(o => o.id === table.orderId ? { ...o, status: "paid", payment: paymentMethod, paidAt: Date.now() } : o));
    setTables(curTables.map(t => t.id === tableId ? { ...t, status: "libre", serverId: null, openedAt: null, orderId: null, covers: 0 } : t));
  }, [session]);

  const toggleAvail = useCallback((itemId) => {
    const cur = S.get("avail", {});
    setAvail({ ...cur, [itemId]: !cur[itemId] });
  }, []);

  const myTables = tables.filter(t => !session || session.role === "admin" || !t.serverId || t.serverId === session.id);

  return (
    <Ctx.Provider value={{
      session, login, logout,
      staff, setStaff, families, setFamilies, menuItems, setMenuItems,
      tables, myTables, openTable, closeTable,
      orders, updateOrder, sendToKitchen, cancelKitchenItem,
      kitchenTickets, updateTicket,
      availability, toggleAvail,
      clockLog, setClock,
      delivery, setDelivery,
      notifications, pushNotif,
      page, setPage,
    }}>
      {children}
    </Ctx.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#09090f;--bg1:#0f0f1a;--bg2:#141420;--bg3:#1a1a28;--bg4:#222234;
  --glass:rgba(255,255,255,.04);--glass2:rgba(255,255,255,.07);--glass3:rgba(255,255,255,.11);
  --border:rgba(255,255,255,.08);--border2:rgba(255,255,255,.14);--border3:rgba(255,255,255,.2);
  --acc:#ff6b35;--acc2:#ff3d6b;--acc3:#ff8c42;
  --acc-g:linear-gradient(135deg,#ff6b35,#ff3d6b);
  --green:#00e5a0;--green-d:rgba(0,229,160,.15);
  --yellow:#ffd166;--yellow-d:rgba(255,209,102,.14);
  --red:#ff4757;--red-d:rgba(255,71,87,.15);
  --blue:#4fc3f7;--blue-d:rgba(79,195,247,.14);
  --purple:#8b5cf6;
  --t1:#ffffff;--t2:rgba(255,255,255,.65);--t3:rgba(255,255,255,.35);--t4:rgba(255,255,255,.18);
  --R:12px;--Rsm:8px;--Rlg:18px;--Rxl:24px;
  --font:'Inter',system-ui,sans-serif;
  --font2:'Space Grotesk',system-ui,sans-serif;
  --shadow:0 4px 24px rgba(0,0,0,.4);
  --shadow-acc:0 8px 32px rgba(255,107,53,.25);
}

html,body,#root{height:100%;background:var(--bg);-webkit-tap-highlight-color:transparent;}
.app{
  height:100%;height:100dvh;
  display:flex;flex-direction:column;
  font-family:var(--font);
  color:var(--t1);
  background:var(--bg);
  overflow:hidden;
  position:relative;
}

/* ── AMBIENT BACKGROUND ── */
.app::before{
  content:'';
  position:fixed;inset:0;z-index:0;
  background:
    radial-gradient(ellipse 500px 400px at -10% -10%, rgba(255,107,53,.12) 0%, transparent 60%),
    radial-gradient(ellipse 400px 350px at 110% 110%, rgba(124,58,237,.14) 0%, transparent 60%),
    radial-gradient(ellipse 300px 300px at 50% 50%, rgba(14,165,233,.06) 0%, transparent 60%);
  pointer-events:none;
  animation:ambDrift 20s ease-in-out infinite alternate;
}
@keyframes ambDrift{from{transform:scale(1) rotate(0deg);}to{transform:scale(1.04) rotate(2deg);}}
::-webkit-scrollbar{width:0;height:0;}

/* ── HEADER ── */
.hdr{
  position:relative;z-index:20;
  padding:16px 16px 0;
  display:flex;align-items:center;gap:12px;
  flex-shrink:0;
}
.profile-wrap{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}
.avatar-ring{
  width:46px;height:46px;border-radius:50%;
  background:var(--acc-g);
  padding:2px;flex-shrink:0;cursor:pointer;
  transition:transform .2s,box-shadow .2s;
}
.avatar-ring:hover,.avatar-ring:active{transform:scale(1.06);box-shadow:var(--shadow-acc);}
.avatar-inner{
  width:100%;height:100%;border-radius:50%;
  background:#1a1a2e;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font2);font-weight:700;font-size:14px;color:var(--t1);
  overflow:hidden;
}
.avatar-inner img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.profile-info{min-width:0;}
.profile-name{font-family:var(--font2);font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.profile-status{display:flex;align-items:center;gap:5px;margin-top:2px;}
.status-dot{width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0;animation:pulseDot 2s infinite;}
@keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(0,229,160,.4);}50%{box-shadow:0 0 0 5px rgba(0,229,160,0);}}
.profile-role{font-size:11px;color:var(--t3);letter-spacing:.3px;}
.hdr-actions{display:flex;align-items:center;gap:7px;}
.icon-btn{
  width:40px;height:40px;border-radius:14px;
  background:var(--glass2);border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:all .2s;
  backdrop-filter:blur(20px);position:relative;
  flex-shrink:0;
}
.icon-btn:hover{background:var(--glass3);border-color:var(--border2);}
.icon-btn:active{transform:scale(.94);}
.icon-btn svg{width:18px;height:18px;stroke:var(--t2);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;}
.notif-dot{position:absolute;top:8px;right:8px;width:7px;height:7px;border-radius:50%;background:var(--red);border:1.5px solid var(--bg);}

/* ── CLOCK BANNER ── */
.cbanner{
  position:relative;z-index:10;
  margin:12px 16px 0;
  background:var(--glass);
  border:1px solid var(--border);
  border-radius:var(--Rlg);
  padding:10px 14px;
  display:flex;align-items:center;gap:10px;
  backdrop-filter:blur(24px);
  animation:slideDown .4s ease;
  flex-shrink:0;
}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
.cbanner-dot{width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0;animation:pulseDot 2s infinite;}
.cbanner-label{font-size:11px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:.8px;}
.cbanner-info{font-size:11px;color:var(--t3);}
.cbanner-dur{font-family:var(--font2);font-weight:700;font-size:13px;color:var(--acc);margin-left:auto;}

/* ── CONTENT ── */
.content{flex:1;overflow-y:auto;position:relative;z-index:1;padding-bottom:88px;}
.page{padding:14px 16px;}
.page-title{font-family:var(--font2);font-size:18px;font-weight:700;margin-bottom:14px;}
.section{margin-bottom:18px;}
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.sec-title{font-family:var(--font2);font-size:14px;font-weight:600;color:var(--t2);}
.sec-badge{background:var(--glass2);border:1px solid var(--border);border-radius:20px;padding:4px 10px;font-size:10px;color:var(--t3);}

/* ── STATS CARDS ── */
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;}
.stat-card{
  background:var(--glass);border:1px solid var(--border);border-radius:var(--Rlg);
  padding:13px 12px;cursor:pointer;transition:all .22s;
  backdrop-filter:blur(20px);
  animation:fadeUp .4s ease backwards;
}
.stat-card:hover{background:var(--glass2);border-color:var(--border2);transform:translateY(-2px);box-shadow:var(--shadow);}
.stat-card:active{transform:scale(.97);}
.stat-card:nth-child(1){animation-delay:.04s;}
.stat-card:nth-child(2){animation-delay:.08s;}
.stat-card:nth-child(3){animation-delay:.12s;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
.stat-icon{width:30px;height:30px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:9px;}
.stat-icon svg{width:15px;height:15px;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;}
.stat-icon.o{background:rgba(255,107,53,.14);stroke:var(--acc);}
.stat-icon.g{background:rgba(0,229,160,.12);stroke:var(--green);}
.stat-icon.b{background:rgba(79,195,247,.12);stroke:var(--blue);}
.stat-icon.p{background:rgba(139,92,246,.12);stroke:var(--purple);}
.stat-val{font-family:var(--font2);font-size:19px;font-weight:700;line-height:1;}
.stat-lbl{font-size:9px;color:var(--t3);margin-top:4px;text-transform:uppercase;letter-spacing:.5px;}

/* ── TABLE GRID — petits carreaux compacts ── */
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px;}
.tcrd{
  background:var(--glass);border:1px solid var(--border);border-radius:14px;
  padding:10px 8px;cursor:pointer;transition:all .22s;
  backdrop-filter:blur(20px);
  position:relative;overflow:hidden;
  height:90px;display:flex;flex-direction:column;align-items:center;justify-content:center;
  animation:fadeUp .4s ease backwards;
  text-align:center;
}
.tcrd::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;border-radius:var(--Rlg) var(--Rlg) 0 0;opacity:0;transition:opacity .2s;}
.tcrd:hover{background:var(--glass2);border-color:var(--border2);transform:translateY(-2px);}
.tcrd:active{transform:scale(.97);}
.tcrd.libre{}
.tcrd.libre:hover::after{opacity:1;background:rgba(255,255,255,.2);}
.tcrd.en-cours{border-color:rgba(255,107,53,.3);}
.tcrd.en-cours::after{opacity:1;background:var(--acc-g);}
.tcrd.envoyé-cuisine{border-color:rgba(255,209,102,.3);}
.tcrd.envoyé-cuisine::after{opacity:1;background:linear-gradient(90deg,#ffd166,#ff9f1c);}
.tcrd.prêt{border-color:rgba(0,229,160,.4);animation:fadeUp .4s ease backwards,glowGreen 2.5s infinite;}
@keyframes glowGreen{0%,100%{box-shadow:0 0 0 0 rgba(0,229,160,0);}50%{box-shadow:0 0 0 6px rgba(0,229,160,.1);}}
.tcrd.prêt::after{opacity:1;background:linear-gradient(90deg,#00e5a0,#00bfa5);}
.tcrd.servi{border-color:rgba(79,195,247,.3);}
.tcrd.servi::after{opacity:1;background:linear-gradient(90deg,#4fc3f7,#0288d1);}
.tnum{font-family:var(--font2);font-size:16px;font-weight:700;margin-top:0;line-height:1;}
.tsb{display:inline-block;font-size:8px;font-weight:700;padding:2px 6px;border-radius:20px;margin-top:3px;letter-spacing:.4px;}
.sb-libre{background:var(--glass2);color:var(--t3);}
.sb-en-cours{background:rgba(255,107,53,.15);color:var(--acc);}
.sb-envoyé-cuisine{background:var(--yellow-d);color:var(--yellow);}
.sb-prêt{background:var(--green-d);color:var(--green);}
.sb-servi{background:var(--blue-d);color:var(--blue);}
.tamt{font-family:var(--font2);font-size:12px;font-weight:700;margin-top:4px;}
.ttmr{font-size:9px;color:var(--t3);margin-top:1px;}
.ttmr.w{color:var(--yellow)!important;}.ttmr.l{color:var(--red)!important;font-weight:600;}
.tsdot{width:6px;height:6px;border-radius:50%;position:absolute;top:7px;right:7px;}
.tcov{font-size:9px;color:var(--t3);margin-top:1px;}

/* ── ORDER SCREEN — layout correct ── */
.oscreen{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative;}
.kitbar{background:rgba(20,20,32,.9);border-bottom:1px solid var(--border);padding:6px 14px;font-size:11px;display:flex;gap:10px;flex-wrap:wrap;flex-shrink:0;backdrop-filter:blur(20px);z-index:5;}
.kbitem{display:flex;align-items:center;gap:4px;}
.kbdot{width:6px;height:6px;border-radius:50%;}
.ocats{display:flex;gap:8px;overflow-x:auto;padding:10px 14px;background:rgba(10,10,18,.8);border-bottom:1px solid var(--border);flex-shrink:0;backdrop-filter:blur(20px);}
.ocats::-webkit-scrollbar{height:0;}
.catpill{display:flex;align-items:center;gap:7px;padding:7px 13px;border-radius:20px;white-space:nowrap;flex-shrink:0;border:1px solid var(--border);font-size:11px;font-weight:600;cursor:pointer;transition:all .18s;backdrop-filter:blur(10px);touch-action:manipulation;}
.catpill:hover{background:var(--glass2);}
.catpill.on{border-color:rgba(255,255,255,.3);color:white;}
.catpill .cpico{width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
.catpill .cplbl{font-size:11px;font-weight:600;}
.omain{flex:1;display:flex;overflow:hidden;min-height:0;}
.marea{flex:1;overflow-y:auto;overflow-x:hidden;padding:12px 14px;}
.mcatttl{font-family:var(--font2);font-size:13px;font-weight:700;color:var(--t2);letter-spacing:.5px;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.kitbadge{font-size:9px;background:rgba(255,107,53,.15);border:1px solid rgba(255,107,53,.3);border-radius:5px;padding:2px 6px;color:var(--acc);}
.mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:9px;}
.mitem{background:var(--glass);border:1px solid var(--border);border-radius:var(--Rlg);cursor:pointer;transition:all .18s;position:relative;backdrop-filter:blur(20px);overflow:hidden;display:flex;flex-direction:column;}
.mitem:hover:not(.unavail){border-color:var(--border2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.35);}
.mitem:active:not(.unavail){transform:scale(.96);}
.mitem.unavail{opacity:.32;cursor:not-allowed;}
.mitem.unavail .iname{text-decoration:line-through;}
.mitem-photo{width:100%;height:85px;overflow:hidden;background:var(--glass2);flex-shrink:0;position:relative;}
.mitem-photo img{width:100%;height:100%;object-fit:cover;display:block;}
.mitem-photo-empty{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:26px;}
.mitem-body{padding:9px 10px 8px;flex:1;display:flex;flex-direction:column;}
.iname{font-size:12px;font-weight:600;color:var(--t1);margin-bottom:2px;line-height:1.3;}
.idesc{font-size:10px;color:var(--t3);line-height:1.3;margin-bottom:5px;flex:1;}
.iprice-row{display:flex;align-items:center;justify-content:space-between;gap:4px;margin-top:auto;}
.iprice{font-family:var(--font2);font-size:15px;font-weight:700;color:var(--acc);}
.ibadge{position:absolute;top:8px;right:8px;background:var(--acc-g);color:white;font-size:9px;font-weight:700;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(255,107,53,.5);z-index:2;}
.istk{font-size:9px;background:var(--glass2);padding:2px 6px;border-radius:5px;color:var(--t3);}
.istk.low{color:var(--yellow)!important;background:var(--yellow-d)!important;}
.istk.out{color:var(--red)!important;background:var(--red-d)!important;font-weight:600;}
.cart{width:285px;flex-shrink:0;background:rgba(9,9,15,.94);border-left:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;backdrop-filter:blur(30px);}
.chdr{padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px;flex-shrink:0;}
.ctitle{font-family:var(--font2);font-size:12px;font-weight:700;letter-spacing:1.5px;color:var(--t2);text-transform:uppercase;flex:1;}
.ctbadge{background:var(--acc-g);border-radius:20px;padding:3px 9px;font-size:10px;color:white;font-weight:700;}
.citems{flex:1;overflow-y:auto;overflow-x:hidden;padding:8px;min-height:0;}
.citem{display:flex;align-items:flex-start;gap:5px;padding:7px 6px;background:var(--glass);border-radius:10px;margin-bottom:4px;border:1px solid var(--border);transition:all .15s;flex-shrink:0;}
.citem:hover{background:var(--glass2);}
.citem.kp{border-color:rgba(255,209,102,.2);}
.ciname{font-size:11px;font-weight:600;color:var(--t1);line-height:1.2;}
.ciopts{font-size:10px;color:var(--t3);margin-top:2px;}
.ciprice{font-size:10px;color:var(--t2);min-width:38px;text-align:right;font-family:var(--font2);font-weight:600;}
.qc{display:flex;align-items:center;gap:2px;}
.qb{background:var(--glass2);border:1px solid var(--border);border-radius:6px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;color:var(--t1);transition:all .12s;flex-shrink:0;touch-action:manipulation;}
.qb:hover{border-color:var(--acc);color:var(--acc);}
.qb:active{transform:scale(.85);}
.qv{font-size:12px;font-weight:700;min-width:16px;text-align:center;}
.cnote{padding:4px 8px;flex-shrink:0;}
.cnote textarea{width:100%;background:var(--glass);border:1px solid var(--border);border-radius:10px;padding:7px 9px;color:var(--t1);font-size:11px;resize:none;height:42px;font-family:var(--font);}
.cnote textarea:focus{outline:none;border-color:rgba(255,107,53,.4);}
.cnote textarea::placeholder{color:var(--t4);}
.cfoot{padding:10px 12px;border-top:1px solid var(--border);flex-shrink:0;}
.ctot{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;}
.ctotl{font-size:11px;color:var(--t3);}
.ctota{font-family:var(--font2);font-size:21px;font-weight:700;}
.cempty{flex:1;display:flex;align-items:center;justify-content:center;color:var(--t4);flex-direction:column;gap:7px;}
.stock-alert{position:absolute;top:54px;left:50%;transform:translateX(-50%);z-index:50;white-space:nowrap;background:rgba(14,14,22,.97);border:1.5px solid var(--red);border-radius:14px;padding:11px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(255,71,87,.4);animation:stockIn .2s cubic-bezier(.16,1,.3,1);backdrop-filter:blur(30px);}
@keyframes stockIn{from{opacity:0;transform:translateX(-50%) translateY(-10px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
.btn{border-radius:12px;padding:12px 14px;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .18s;width:100%;margin-bottom:6px;letter-spacing:.3px;font-family:var(--font);touch-action:manipulation;}
.btn:active{transform:scale(.97);}
.btn:last-child{margin-bottom:0;}
.btn-acc{background:var(--acc-g);color:white;box-shadow:0 4px 16px rgba(255,107,53,.3);}
.btn-acc:hover{opacity:.9;}
.btn-sec{background:var(--glass2);border:1px solid var(--border);color:var(--t1);}
.btn-sec:hover{background:var(--glass3);border-color:var(--border2);}
.btn-green{background:linear-gradient(135deg,#00e5a0,#00bfa5);color:#000;font-weight:800;box-shadow:0 4px 16px rgba(0,229,160,.25);}
.btn-green:hover{filter:brightness(1.06);}
.btn-kitch{background:rgba(255,209,102,.15);border:1px solid rgba(255,209,102,.3);color:var(--yellow);}
.btn-kitch:hover{background:rgba(255,209,102,.25);}
.btn-kitch:disabled{opacity:.35;cursor:not-allowed;}
.btn-sm{padding:7px 10px;font-size:11px;}


/* ── KITCHEN ── */
.kitchen{flex:1;overflow:hidden;display:flex;flex-direction:column;background:var(--bg);}
.khdr{
  background:rgba(15,15,26,.9);padding:12px 16px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:10px;flex-shrink:0;flex-wrap:wrap;
  backdrop-filter:blur(30px);
}
.ktitle{font-family:var(--font2);font-size:18px;font-weight:700;color:var(--t1);letter-spacing:1px;}
.kcols{flex:1;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:12px;overflow:hidden;}
.kcol{background:var(--glass);border:1px solid var(--border);border-radius:var(--Rlg);display:flex;flex-direction:column;overflow:hidden;backdrop-filter:blur(20px);}
.kchdr{padding:10px 13px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px;}
.kctitle{font-family:var(--font2);font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;}
.cp .kctitle{color:var(--t2);}
.cprep .kctitle{color:var(--yellow);}
.crdy .kctitle{color:var(--green);}
.kccnt{background:var(--glass2);border:1px solid var(--border);border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;}
.kticks{flex:1;overflow-y:auto;padding:7px;display:flex;flex-direction:column;gap:7px;}
.ktick{
  background:var(--glass);border:1px solid var(--border);border-radius:var(--R);padding:11px;
  transition:all .25s;position:relative;overflow:hidden;
}
.ktick::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;opacity:0;transition:opacity .2s;}
.ktick.newt{animation:slideIn .3s cubic-bezier(.16,1,.3,1);border-color:rgba(255,107,53,.3);}
.ktick.newt::before{opacity:1;background:var(--acc-g);}
.ktick.verylate{border-color:rgba(255,71,87,.4);animation:slideIn .3s ease,blinkR 1.5s infinite;}
.ktick.verylate::before{opacity:1;background:linear-gradient(90deg,var(--red),#ff6b6b);}
@keyframes slideIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
@keyframes blinkR{0%,100%{border-color:rgba(255,71,87,.4);}50%{border-color:rgba(255,71,87,.1);}}
.kthdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;}
.kttbl{font-family:var(--font2);font-size:16px;font-weight:700;}
.kttm{font-size:10px;color:var(--t3);}
.kttm.late{color:var(--red);font-weight:700;}
.kttm.warn{color:var(--yellow);}
.ktitems{display:flex;flex-direction:column;gap:3px;margin-bottom:8px;}
.ktitem{font-size:11px;color:var(--t1);display:flex;gap:5px;}
.ktqty{color:var(--acc);font-weight:700;font-family:var(--font2);font-size:13px;min-width:18px;}
.ktnote{font-size:10px;color:var(--yellow);background:var(--yellow-d);padding:4px 7px;border-radius:7px;margin-bottom:7px;border:1px solid rgba(255,209,102,.2);}
.ktcancel{font-size:10px;color:var(--red);background:var(--red-d);padding:3px 6px;border-radius:6px;margin-top:3px;cursor:pointer;display:inline-block;border:1px solid rgba(255,71,87,.2);}
.ktcancel:hover{background:var(--red);color:white;}
.kbt{
  padding:8px 10px;border-radius:10px;border:none;cursor:pointer;
  font-size:11px;font-weight:700;transition:all .15s;width:100%;margin-top:5px;
  font-family:var(--font);letter-spacing:.3px;touch-action:manipulation;
}
.kbt:active{transform:scale(.96);}
.kbt-prep{background:rgba(255,209,102,.15);border:1px solid rgba(255,209,102,.25);color:var(--yellow);}
.kbt-prep:hover{background:rgba(255,209,102,.25);}
.kbt-rdy{background:rgba(0,229,160,.12);border:1px solid rgba(0,229,160,.25);color:var(--green);}
.kbt-rdy:hover{background:rgba(0,229,160,.22);}
.kbt-srv{background:rgba(79,195,247,.12);border:1px solid rgba(79,195,247,.25);color:var(--blue);}
.kbt-srv:hover{background:rgba(79,195,247,.22);}
.alert-band{background:linear-gradient(90deg,var(--red),#ff6b6b);color:white;text-align:center;font-size:11px;font-weight:700;padding:6px;letter-spacing:.8px;animation:alertBlink 1s infinite;flex-shrink:0;}
@keyframes alertBlink{0%,100%{opacity:1;}50%{opacity:.75;}}

/* Kitchen read-only */
.kro{flex:1;overflow:hidden;display:flex;flex-direction:column;}
.kro-banner{background:rgba(15,15,26,.85);border-bottom:1px solid var(--border);padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;flex-wrap:wrap;backdrop-filter:blur(20px);}
.kro-title{font-family:var(--font2);font-size:16px;font-weight:700;color:var(--t1);}
.kro-badge{font-size:10px;background:var(--glass2);border:1px solid var(--border);border-radius:6px;padding:3px 9px;color:var(--t3);text-transform:uppercase;letter-spacing:.8px;}
.kro-cols{flex:1;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:12px;overflow:hidden;}
.kro-col{background:var(--glass);border:1px solid var(--border);border-radius:var(--Rlg);display:flex;flex-direction:column;overflow:hidden;backdrop-filter:blur(20px);}
.kro-chdr{padding:10px 13px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:6px;}
.kro-ctitle{font-family:var(--font2);font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;}
.kro-tickets{flex:1;overflow-y:auto;padding:7px;display:flex;flex-direction:column;gap:7px;}
.kro-tick{background:var(--glass);border:1px solid var(--border);border-radius:var(--R);padding:10px;}
.kro-tick.mine{border-color:rgba(255,107,53,.25);}
.kro-tick.ready{border-color:rgba(0,229,160,.3);background:rgba(0,229,160,.04);}

/* ── MODALS ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:300;padding:16px;backdrop-filter:blur(10px);}
.modal{background:rgba(20,20,30,.96);border:1px solid var(--border2);border-radius:var(--Rxl);width:100%;max-width:410px;max-height:92vh;overflow-y:auto;backdrop-filter:blur(40px);box-shadow:0 24px 60px rgba(0,0,0,.6);}
.mhdr{padding:18px 22px 14px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;}
.mtitle{font-family:var(--font2);font-size:17px;font-weight:700;letter-spacing:.5px;}
.mclose{background:var(--glass2);border:1px solid var(--border);border-radius:10px;width:28px;height:28px;cursor:pointer;color:var(--t2);font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.mclose:hover{background:var(--glass3);}
.mbody{padding:18px 22px;}
.bitems{margin-bottom:13px;display:flex;flex-direction:column;gap:6px;}
.bi{display:flex;justify-content:space-between;font-size:13px;}
.bi.sub{border-top:1px solid var(--border);padding-top:8px;margin-top:3px;}
.bi.tot{font-family:var(--font2);font-size:19px;font-weight:700;border-top:1px solid rgba(255,107,53,.3);padding-top:9px;}
.blbl{color:var(--t2);}
.bval{font-weight:600;}
.paybts{display:flex;gap:8px;margin-top:13px;flex-wrap:wrap;}
.paybt{flex:1;min-width:64px;padding:12px;border-radius:12px;border:1px solid var(--border);background:var(--glass);color:var(--t1);font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;display:flex;flex-direction:column;align-items:center;gap:4px;backdrop-filter:blur(10px);}
.paybt:hover{border-color:rgba(255,107,53,.4);background:rgba(255,107,53,.12);}
.payico{font-size:18px;}
.omods{background:rgba(20,20,30,.96);border:1px solid var(--border2);border-radius:var(--Rxl);padding:18px;width:100%;max-width:340px;backdrop-filter:blur(40px);}
.omtitle{font-family:var(--font2);font-size:14px;font-weight:700;margin-bottom:13px;color:var(--acc);}
.orow{display:flex;flex-direction:column;gap:5px;margin-bottom:11px;}
.olbl{font-size:11px;color:var(--t2);font-weight:500;}
.chips{display:flex;flex-wrap:wrap;gap:5px;}
.chip{padding:5px 10px;border-radius:20px;border:1px solid var(--border);background:var(--glass);color:var(--t2);font-size:11px;cursor:pointer;transition:all .15s;}
.chip:hover{border-color:rgba(255,107,53,.35);color:var(--acc);}
.chip.on{background:rgba(255,107,53,.15);border-color:rgba(255,107,53,.35);color:var(--acc);}
.oinp{background:var(--glass);border:1px solid var(--border);border-radius:10px;padding:8px 11px;color:var(--t1);font-size:12px;font-family:var(--font);width:100%;}
.oinp:focus{outline:none;border-color:rgba(255,107,53,.4);}

/* Logout modal */
.logout-modal{background:rgba(14,14,22,.97);border:1px solid var(--border2);border-radius:var(--Rxl);width:100%;max-width:480px;max-height:92vh;overflow-y:auto;backdrop-filter:blur(40px);box-shadow:0 24px 60px rgba(0,0,0,.7);}
.logout-header{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;}
.logout-icon{font-size:22px;}
.logout-title{font-family:var(--font2);font-size:20px;font-weight:700;flex:1;}
.logout-body{padding:18px 24px;}
.alert-blk{border-radius:12px;padding:13px 15px;margin-bottom:10px;border-left:3px solid;}
.alert-blk.warn{background:rgba(255,209,102,.08);border-color:var(--yellow);}
.alert-blk.danger{background:var(--red-d);border-color:var(--red);}
.alert-blk.ok{background:var(--green-d);border-color:var(--green);}
.alert-blk-ttl{font-weight:700;font-size:12px;margin-bottom:4px;display:flex;align-items:center;gap:6px;}
.alert-blk-sub{font-size:11px;color:var(--t2);line-height:1.6;}
.recap-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:13px;}
.recap-card{background:var(--glass);border:1px solid var(--border);border-radius:12px;padding:11px;text-align:center;backdrop-filter:blur(10px);}
.recap-lbl{font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px;}
.recap-val{font-family:var(--font2);font-size:21px;font-weight:700;color:var(--acc);}
.pin-confirm{background:var(--glass);border:1px solid var(--border);border-radius:14px;padding:13px;margin-bottom:10px;}
.pin-confirm-lbl{font-size:11px;color:var(--t2);text-align:center;margin-bottom:8px;}
.pin-confirm-disp{background:rgba(0,0,0,.3);border:1px solid var(--border2);border-radius:10px;text-align:center;font-family:var(--font2);font-size:26px;letter-spacing:14px;color:var(--acc);height:52px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
.pin-confirm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;}
.pin-confirm-btn{background:var(--glass);border:1px solid var(--border);border-radius:10px;color:var(--t1);font-size:17px;font-family:var(--font2);font-weight:600;padding:11px;cursor:pointer;transition:all .15s;touch-action:manipulation;}
.pin-confirm-btn:hover{background:var(--glass2);border-color:var(--border2);}
.pin-confirm-btn:active{transform:scale(.92);}
.pin-err-msg{color:var(--red);text-align:center;font-size:11px;min-height:16px;margin-top:5px;}

/* ── STATS ── */
.spg{flex:1;overflow-y:auto;padding:14px 16px;padding-bottom:88px;}
.sgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:9px;margin-bottom:18px;}
.scrd{background:var(--glass);border:1px solid var(--border);border-radius:var(--Rlg);padding:14px;backdrop-filter:blur(20px);}
.slbl{font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px;}
.sval{font-family:var(--font2);font-size:26px;font-weight:700;color:var(--acc);}
.sunit{font-size:12px;color:var(--t2);}
.stitle{font-family:var(--font2);font-size:14px;font-weight:600;color:var(--t2);letter-spacing:.5px;text-transform:uppercase;margin-bottom:11px;}
.toplist{display:flex;flex-direction:column;gap:7px;margin-bottom:18px;}
.topitem{display:flex;align-items:center;gap:9px;background:var(--glass);border:1px solid var(--border);border-radius:var(--R);padding:10px 13px;backdrop-filter:blur(20px);transition:all .2s;}
.topitem:hover{background:var(--glass2);}
.toprank{font-family:var(--font2);font-size:16px;font-weight:700;color:var(--t3);min-width:22px;}
.toprank.g{color:#ffd166;text-shadow:0 0 8px rgba(255,209,102,.4);}
.toprank.s{color:rgba(255,255,255,.6);}
.toprank.b{color:rgba(255,107,53,.7);}
.topname{flex:1;font-size:12px;color:var(--t1);}
.topcnt{font-size:10px;color:var(--t3);background:var(--glass2);border:1px solid var(--border);padding:2px 8px;border-radius:20px;}
.toprev{font-family:var(--font2);font-size:13px;font-weight:600;color:var(--acc);min-width:48px;text-align:right;}
.srvrow{display:flex;align-items:center;gap:9px;background:var(--glass);border:1px solid var(--border);border-radius:var(--R);padding:10px 13px;margin-bottom:6px;backdrop-filter:blur(20px);}
.clockrow{display:flex;align-items:center;gap:8px;background:var(--glass);border:1px solid var(--border);border-radius:10px;padding:9px 12px;margin-bottom:5px;font-size:12px;backdrop-filter:blur(10px);}
.clkpill{font-size:9px;padding:2px 8px;border-radius:20px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;}
.clkpill.in{background:rgba(0,229,160,.15);color:var(--green);border:1px solid rgba(0,229,160,.25);}
.clkpill.out{background:var(--glass2);color:var(--t3);border:1px solid var(--border);}

/* ── ADMIN ── */
.apg{flex:1;overflow-y:auto;padding:14px 16px;padding-bottom:88px;}
.atabs{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;}
.atab{padding:8px 14px;border:1px solid var(--border);border-radius:20px;background:var(--glass);color:var(--t2);font-size:11px;cursor:pointer;transition:all .15s;font-weight:600;backdrop-filter:blur(10px);touch-action:manipulation;}
.atab:hover{background:var(--glass2);}
.atab.on{background:rgba(255,107,53,.2);border-color:rgba(255,107,53,.35);color:var(--acc);}
.asec{background:var(--glass);border:1px solid var(--border);border-radius:var(--Rlg);padding:15px;margin-bottom:12px;backdrop-filter:blur(20px);}
.asectitle{font-family:var(--font2);font-size:12px;font-weight:700;letter-spacing:1.5px;color:var(--acc);text-transform:uppercase;margin-bottom:11px;}
.frow{display:flex;gap:7px;margin-bottom:8px;flex-wrap:wrap;}
.fi{background:var(--glass);border:1px solid var(--border);border-radius:10px;padding:8px 11px;color:var(--t1);font-size:12px;font-family:var(--font);flex:1;min-width:100px;transition:border-color .15s;}
.fi:focus{outline:none;border-color:rgba(255,107,53,.4);}
.fsel{background:var(--glass);border:1px solid var(--border);border-radius:10px;padding:8px 11px;color:var(--t1);font-size:12px;font-family:var(--font);transition:border-color .15s;}
.fsel:focus{outline:none;border-color:rgba(255,107,53,.4);}
.atable{width:100%;border-collapse:collapse;}
.atable th{padding:7px 9px;text-align:left;font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border);}
.atable td{padding:8px 9px;font-size:11px;border-bottom:1px solid rgba(255,255,255,.05);}
.atable tr:last-child td{border-bottom:none;}
.atable tr:hover td{background:var(--glass);}
.tog{width:34px;height:18px;background:var(--glass2);border-radius:9px;cursor:pointer;position:relative;transition:all .2s;border:1px solid var(--border);flex-shrink:0;}
.tog.on{background:rgba(0,229,160,.35);border-color:rgba(0,229,160,.4);}
.tog::after{content:'';position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:var(--t3);transition:all .2s;}
.tog.on::after{transform:translateX(16px);background:var(--green);}
.ibtn{background:var(--glass);border:1px solid var(--border);border-radius:8px;padding:4px 9px;color:var(--t2);font-size:10px;cursor:pointer;transition:all .15s;}
.ibtn:hover{color:var(--t1);border-color:var(--border2);background:var(--glass2);}
.ibtn.r{color:var(--red);border-color:rgba(255,71,87,.2);}
.ibtn.r:hover{background:var(--red-d);}
.ibtn.g{color:var(--green);border-color:rgba(0,229,160,.2);}
.ibtn.g:hover{background:var(--green-d);}

/* ── BOTTOM NAV ── */
.bnav{
  position:fixed;bottom:0;left:50%;transform:translateX(-50%);
  width:100%;max-width:100%;z-index:100;
  padding:0 12px max(12px,env(safe-area-inset-bottom));
  pointer-events:none;
}
.bnav-inner{
  display:flex;align-items:center;justify-content:space-around;
  background:rgba(12,12,20,.85);border:1px solid var(--border2);
  border-radius:24px;padding:10px 6px;
  backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);
  pointer-events:all;
  box-shadow:0 -2px 30px rgba(0,0,0,.4);
}
.nav-item{
  display:flex;flex-direction:column;align-items:center;gap:3px;
  padding:7px 12px;border-radius:16px;cursor:pointer;transition:all .2s;
  position:relative;min-width:54px;touch-action:manipulation;
}
.nav-item svg{width:22px;height:22px;fill:none;stroke:var(--t3);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;transition:all .2s;}
.nav-item .nav-lbl{font-size:9px;color:var(--t3);font-weight:600;text-transform:uppercase;letter-spacing:.4px;transition:color .2s;}
.nav-item.active svg{stroke:var(--acc);}
.nav-item.active .nav-lbl{color:var(--acc);}
.nav-item.active{background:rgba(255,107,53,.12);}
.nav-item.active:hover{background:rgba(255,107,53,.16);}
.nav-item:hover:not(.active){background:var(--glass2);}
.nav-item:active{transform:scale(.92);}
.nav-item.fab{
  background:var(--acc-g);border-radius:18px;
  padding:9px 14px;margin:0 3px;
  box-shadow:var(--shadow-acc);
}
.nav-item.fab svg{stroke:white;}
.nav-item.fab .nav-lbl{color:rgba(255,255,255,.8);}
.nav-item.fab:hover{filter:brightness(1.08);box-shadow:0 6px 24px rgba(255,107,53,.45);}
.nav-item.fab:active{transform:scale(.92);}
.nav-item.fab.active{background:var(--acc-g);}
.nav-bdg{position:absolute;top:4px;right:6px;background:var(--red);color:white;border-radius:50%;width:14px;height:14px;font-size:8px;font-weight:800;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--bg);}
.nav-bdg.green{background:var(--green);color:#000;}
.nav-back-btn{
  display:flex;align-items:center;gap:6px;
  background:var(--glass2);border:1px solid var(--border);border-radius:12px;
  padding:7px 12px;cursor:pointer;transition:all .2s;font-size:12px;font-weight:600;color:var(--acc);
  backdrop-filter:blur(10px);touch-action:manipulation;
}
.nav-back-btn:hover{background:rgba(255,107,53,.12);border-color:rgba(255,107,53,.3);}
.nav-back-btn:active{transform:scale(.95);}
.nav-back-btn svg{width:15px;height:15px;fill:none;stroke:var(--acc);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}

/* ── PLAN ── */
.plan{flex:1;overflow-y:auto;padding:14px 16px;padding-bottom:88px;}
.ptoolbar{display:flex;align-items:center;gap:8px;margin-bottom:13px;flex-wrap:wrap;}
.ptitle{font-family:var(--font2);font-size:17px;font-weight:700;}
.ptag{background:var(--glass2);border:1px solid var(--border);border-radius:20px;padding:4px 10px;font-size:10px;color:var(--t3);white-space:nowrap;}
/* Section tables + livraisons */
.plan-section-title{font-family:var(--font2);font-size:12px;font-weight:700;color:var(--t2);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:9px;margin-top:18px;display:flex;align-items:center;gap:8px;}
.plan-section-title:first-of-type{margin-top:0;}
.plan-section-title .stag{font-size:9px;font-weight:700;padding:2px 8px;border-radius:20px;letter-spacing:.5px;}
/* Commandes livraison */
.delivery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:9px;margin-bottom:4px;}
.delivery-card{
  background:var(--glass);border:1px solid var(--border);border-radius:14px;
  padding:13px;cursor:pointer;transition:all .2s;backdrop-filter:blur(20px);
  position:relative;overflow:hidden;
  display:flex;flex-direction:column;gap:4px;
}
.delivery-card::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0;}
.delivery-card:hover{background:var(--glass2);transform:translateY(-2px);}
.delivery-card:active{transform:scale(.97);}
.delivery-card.uber::after{background:linear-gradient(90deg,#06c167,#00e676);}
.delivery-card.uber{border-color:rgba(6,193,103,.3);}
.delivery-card.emporter::after{background:var(--acc-g);}
.delivery-card.emporter{border-color:rgba(255,107,53,.3);}
.delivery-card.en-cours::after{background:var(--acc-g);border-color:rgba(255,107,53,.4);}
.delivery-card.envoyé-cuisine::after{background:linear-gradient(90deg,#ffd166,#ff9f1c);}
.dc-header{display:flex;align-items:center;gap:8px;}
.dc-icon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
.dc-icon.uber{background:rgba(6,193,103,.15);}
.dc-icon.emporter{background:rgba(255,107,53,.15);}
.dc-ref{font-family:var(--font2);font-size:14px;font-weight:700;flex:1;}
.dc-status{font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;letter-spacing:.4px;}
.dc-items{font-size:11px;color:var(--t2);line-height:1.4;}
.dc-footer{display:flex;align-items:center;justify-content:space-between;margin-top:4px;}
.dc-amt{font-family:var(--font2);font-size:14px;font-weight:700;color:var(--acc);}
.dc-tmr{font-size:10px;color:var(--t3);}
/* Bouton nouvelle livraison */
.btn-new-delivery{
  display:flex;align-items:center;gap:8px;
  background:var(--glass);border:1px solid var(--border);
  border-radius:12px;padding:10px 14px;cursor:pointer;
  font-size:12px;font-weight:600;color:var(--t2);
  transition:all .2s;backdrop-filter:blur(10px);
  touch-action:manipulation;
}
.btn-new-delivery:hover{background:var(--glass2);color:var(--t1);}
.btn-new-delivery svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
/* Modal nouvelle livraison */
.delivery-modal{background:rgba(14,14,22,.97);border:1px solid var(--border2);border-radius:var(--Rxl);width:100%;max-width:420px;max-height:92vh;overflow-y:auto;backdrop-filter:blur(40px);box-shadow:0 24px 60px rgba(0,0,0,.7);}
.type-selector{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
.type-btn{padding:14px;border-radius:14px;border:1px solid var(--border);background:var(--glass);cursor:pointer;transition:all .2s;text-align:center;font-size:13px;font-weight:600;touch-action:manipulation;}
.type-btn:hover{background:var(--glass2);}
.type-btn.sel.uber{background:rgba(6,193,103,.15);border-color:rgba(6,193,103,.4);color:#06c167;}
.type-btn.sel.emporter{background:rgba(255,107,53,.15);border-color:rgba(255,107,53,.4);color:var(--acc);}
.type-ico{font-size:24px;margin-bottom:6px;display:block;}

/* ── LOGIN ── */
.login{
  min-height:100%;display:flex;align-items:center;justify-content:center;
  padding:16px;overflow-y:auto;position:relative;z-index:10;
}
.lcard{
  background:rgba(14,14,22,.9);border:1px solid var(--border2);
  border-radius:var(--Rxl);padding:28px;width:100%;max-width:420px;
  backdrop-filter:blur(40px);box-shadow:0 24px 60px rgba(0,0,0,.6);
  animation:fadeUp .5s ease;
}
.logo{font-family:var(--font2);font-size:30px;font-weight:700;text-align:center;letter-spacing:4px;margin-bottom:3px;background:var(--acc-g);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.logo-sub{text-align:center;color:var(--t3);font-size:11px;margin-bottom:22px;letter-spacing:2px;text-transform:uppercase;}
.rtabs{display:flex;gap:6px;margin-bottom:16px;}
.rtab{flex:1;padding:10px 4px;border:1px solid var(--border);border-radius:20px;background:var(--glass);color:var(--t3);font-size:10px;cursor:pointer;text-align:center;transition:all .18s;font-weight:700;letter-spacing:.5px;text-transform:uppercase;touch-action:manipulation;backdrop-filter:blur(10px);}
.rtab:hover{background:var(--glass2);}
.rtab.on{background:rgba(255,107,53,.2);border-color:rgba(255,107,53,.4);color:var(--acc);}
.slist{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;max-height:220px;overflow-y:auto;}
.sbtn{display:flex;align-items:center;gap:10px;background:var(--glass);border:1px solid var(--border);border-radius:14px;padding:11px 14px;cursor:pointer;transition:all .18s;color:var(--t1);font-size:13px;font-weight:500;touch-action:manipulation;backdrop-filter:blur(10px);}
.sbtn:hover{background:var(--glass2);border-color:var(--border2);}
.sbtn.sel{background:rgba(255,107,53,.15);border-color:rgba(255,107,53,.35);}
.sdot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
.srbadge{margin-left:auto;font-size:9px;padding:2px 7px;border-radius:20px;background:var(--glass2);color:var(--t3);text-transform:uppercase;letter-spacing:.5px;border:1px solid var(--border);}
.pin-disp{
  background:rgba(0,0,0,.3);border:1px solid var(--border2);border-radius:14px;
  text-align:center;font-family:var(--font2);font-size:36px;letter-spacing:14px;
  color:var(--acc);margin-bottom:16px;min-height:66px;display:flex;align-items:center;justify-content:center;
}
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;}
.pbtn{
  background:var(--glass);border:1px solid var(--border);border-radius:12px;
  color:var(--t1);font-size:20px;font-family:var(--font2);font-weight:600;
  padding:14px;cursor:pointer;transition:all .15s;touch-action:manipulation;
  backdrop-filter:blur(10px);
}
.pbtn:hover{background:var(--glass2);border-color:var(--border2);}
.pbtn:active{transform:scale(.92);background:rgba(255,107,53,.15);border-color:rgba(255,107,53,.3);}
.perr{color:var(--red);text-align:center;font-size:12px;min-height:18px;margin-top:6px;}

/* ── BANNER UBADGE ── */
.ubadge{display:flex;align-items:center;gap:5px;background:var(--glass);border:1px solid var(--border);border-radius:10px;padding:5px 9px;font-size:11px;flex-shrink:0;white-space:nowrap;backdrop-filter:blur(10px);}
.urole{font-size:9px;background:var(--glass2);border-radius:5px;padding:1px 5px;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;border:1px solid var(--border);}
.hbtn{background:var(--glass);border:1px solid var(--border);border-radius:10px;padding:7px 11px;color:var(--t2);font-size:11px;cursor:pointer;transition:all .15s;white-space:nowrap;font-weight:600;flex-shrink:0;touch-action:manipulation;backdrop-filter:blur(10px);}
.hbtn:hover{color:var(--t1);border-color:var(--border2);background:var(--glass2);}
.hbtn.on{color:var(--acc);border-color:rgba(255,107,53,.35);background:rgba(255,107,53,.12);}
.hbtn.red{color:var(--red);border-color:rgba(255,71,87,.25);}
.hbtn.red:hover{background:var(--red-d);}
.hsp{flex:1;min-width:4px;}

/* ── TOASTS ── */
.tstack{position:fixed;bottom:90px;right:12px;display:flex;flex-direction:column;gap:7px;z-index:500;pointer-events:none;}
.toast{
  background:rgba(20,20,32,.95);border:1px solid var(--border2);
  border-radius:12px;padding:10px 14px;font-size:12px;max-width:240px;
  animation:tin .3s cubic-bezier(.16,1,.3,1);pointer-events:none;line-height:1.4;
  backdrop-filter:blur(20px);
}
.toast.kitchen_new{border-color:rgba(255,107,53,.4);background:rgba(255,107,53,.12);}
.toast.ready{border-color:rgba(0,229,160,.4);background:rgba(0,229,160,.12);color:var(--green);}
.toast.served{border-color:rgba(79,195,247,.4);background:rgba(79,195,247,.12);color:var(--blue);}
.toast.cancel{border-color:rgba(255,71,87,.4);background:var(--red-d);color:var(--red);}
.toast.preparing{border-color:rgba(255,209,102,.4);background:var(--yellow-d);color:var(--yellow);}
@keyframes tin{from{opacity:0;transform:translateX(16px);}to{opacity:1;transform:translateX(0);}}

/* ── ANIMATIONS ── */
@keyframes slide-in{from{opacity:0;transform:translateX(-50%) translateY(-8px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}

/* ══════════════
   RESPONSIVE
══════════════ */
@media(max-width:900px){
  .cart{width:230px;}
  .tgrid{grid-template-columns:repeat(auto-fill,minmax(80px,1fr));}
  .kcols{gap:8px;padding:9px;}
  .kro-cols{gap:8px;padding:9px;}
}

@media(max-width:640px){
  .hdr{padding:12px 12px 0;}
  /* nav btns hidden on mobile — bottom nav takes over */
  .hbtn{display:none;}
  .hbtn.red{display:flex;}
  .ubadge .urole{display:none;}
  /* order screen goes vertical */
  .oscreen{flex-direction:column;}
  .ocats{padding:9px 10px;gap:6px;}
  .catpill{padding:7px 12px;font-size:10px;}
  .omain{flex-direction:column;overflow:visible;}
  .marea{flex:none;padding:9px 10px;min-height:260px;}
  .mgrid{grid-template-columns:repeat(auto-fill,minmax(130px,1fr));}
  .cart{width:100%;border-left:none;border-top:1px solid var(--border);height:240px;}
  .citems{max-height:90px;}
  .cnote{display:none;}
  /* kitchen vertical */
  .kcols{grid-template-columns:1fr;overflow-y:auto;gap:0;padding:0;}
  .kcol{border-radius:0;border:none;border-bottom:1px solid var(--border);max-height:280px;}
  .kro-cols{grid-template-columns:1fr;overflow-y:auto;gap:0;padding:0;}
  .kro-col{border-radius:0;border:none;border-bottom:1px solid var(--border);max-height:240px;}
  /* plan */
  .plan{padding:10px 12px;padding-bottom:88px;}
  .tgrid{gap:6px;}
  .tcrd{min-height:94px;padding:10px;}
  .tnum{font-size:18px;}
  /* modal fullscreen */
  .overlay{padding:0;align-items:flex-end;}
  .modal{border-radius:24px 24px 0 0;max-width:100%;max-height:86vh;}
  .logout-modal{border-radius:24px 24px 0 0;max-width:100%;max-height:92vh;}
  .omods{border-radius:24px 24px 0 0;max-width:100%;}
  /* stats/admin */
  .spg{padding:10px 12px;padding-bottom:88px;}
  .sgrid{grid-template-columns:1fr 1fr;}
  .apg{padding:10px 12px;padding-bottom:88px;}
  .atab{padding:6px 10px;font-size:10px;}
  /* clock banner */
  .cbanner{margin:9px 12px 0;padding:9px 12px;}
  .cbanner-info{display:none;}
}

@media(max-width:380px){
  .lcard{padding:20px;}
  .logo{font-size:24px;}
  .pbtn{padding:12px;}
  .tgrid{grid-template-columns:repeat(4,1fr);}
  .stats-grid{grid-template-columns:1fr 1fr;}
  .sgrid{grid-template-columns:1fr;}
  .recap-grid{grid-template-columns:1fr 1fr;}
}
`;

// ═══════════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════════
const fmtT = (ms) => { const m = Math.floor(ms / 60000), h = Math.floor(m / 60); return h > 0 ? `${h}h${String(m % 60).padStart(2, "0")}` : `${m}min`; };
const tClass = (ms) => { const m = ms / 60000; return m > 90 ? "l" : m > 60 ? "w" : ""; };
const orderTot = (items, menu) => items.reduce((s, i) => { const mi = menu.find(m => m.id === i.menuId); return s + (mi ? mi.price * i.qty : 0); }, 0);
const COLORS = ["#e67e22","#e74c3c","#9b59b6","#27ae60","#3498db","#1abc9c","#f39c12","#d35400","#8e44ad","#16a085","#2c3e50","#7f8c8d"];
const CUISSONS = ["Bleu","Saignant","À point","Bien cuit"];
const SANS_OPT = ["Oignon","Ail","Piment","Sel","Sauce","Piment fort","Citron","Herbes","Fromage","Crème"];
const FAMILIES_WITH_ACCOMP = new Set(["fam_grillades", "fam_yassa", "fam_mafe", "fam_thiep", "fam_centre", "fam_voyages"]);
const FAMILIES_WITH_CUISSON = new Set(["fam_grillades"]);
const itemNeedsOptionsModal = (item) => FAMILIES_WITH_ACCOMP.has(item.familyId) || FAMILIES_WITH_CUISSON.has(item.familyId);

// ═══════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════
function Login() {
  const { login, staff } = useApp();
  const [role, setRole] = useState("serveur");
  const [sel, setSel] = useState(null);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  const filtered = staff.filter(s => s.active && s.role === role);

  const tap = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      const member = sel
        ? staff.find(s => s.id === sel && s.pin === next)
        : staff.find(s => s.role === role && s.pin === next && s.active);
      if (member) { login(member); }
      else { setTimeout(() => { setPin(""); setErr("Code PIN incorrect ❌"); }, 300); }
    } else setErr("");
  };

  return (
    <div className="login">
      <div className="lcard">
        <div className="logo">🍽 LE DAAKAR</div>
        <div className="logo-sub">POS Pro v3 — Identification</div>
        <div className="rtabs">
          {[["admin","👑 Admin"],["serveur","🧑 Serveur"],["cuisine","👨‍🍳 Cuisine"]].map(([r, l]) => (
            <button key={r} className={`rtab${role === r ? " on" : ""}`} onClick={() => { setRole(r); setSel(null); setPin(""); setErr(""); }}>{l}</button>
          ))}
        </div>
        <div className="slist">
          {filtered.length === 0 && <div style={{ color: "var(--t3)", fontSize: 12, textAlign: "center", padding: "10px 0" }}>Aucun membre actif pour ce rôle</div>}
          {filtered.map(s => (
            <button key={s.id} className={`sbtn${sel === s.id ? " sel" : ""}`} onClick={() => { setSel(s.id); setPin(""); setErr(""); }}>
              <div className="sdot" style={{ background: s.color }} />
              {s.name}
              <span className="srbadge">{s.role}</span>
            </button>
          ))}
        </div>
        <div className="pin-disp">{pin ? "●".repeat(pin.length) : <span style={{ color: "var(--t3)", fontSize: 24, letterSpacing: 8 }}>· · · ·</span>}</div>
        <div className="pgrid">
          {[1,2,3,4,5,6,7,8,9].map(n => <button key={n} className="pbtn" onClick={() => tap(String(n))}>{n}</button>)}
          <button className="pbtn" onClick={() => { setPin(""); setErr(""); }}>⌫</button>
          <button className="pbtn" onClick={() => tap("0")}>0</button>
          <div />
        </div>
        <div className="perr">{err}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CLOCK BANNER — shown on all screens after login
// ═══════════════════════════════════════════════════════════════════
function ClockBanner() {
  const { session, clockLog } = useApp();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);

  if (!session) return null;
  const today = new Date().toDateString();
  const entry = clockLog.find(l => l.staffId === session.id && new Date(l.clockIn).toDateString() === today && !l.clockOut);
  if (!entry) return null;
  const dur = now - entry.clockIn;
  const h = Math.floor(dur / 3600000);
  const m = Math.floor((dur % 3600000) / 60000);
  const clockInStr = new Date(entry.clockIn).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="cbanner">
      <div className="cbanner-dot" />
      <div className="cbanner-label">En service</div>
      <div className="cbanner-info">Depuis {clockInStr}</div>
      <div className="cbanner-dur">{h}h{String(m).padStart(2, "0")}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════════
function Header({ activeTable, onBack, onLogoutRequest }) {
  const { session, page, setPage, kitchenTickets } = useApp();
  const pending = kitchenTickets.filter(t => t.status === "pending").length;
  const ready   = kitchenTickets.filter(t => t.status === "ready").length;
  const initials = (n = "") => n.split(" ").map(w => w[0] || "").join("").slice(0, 2).toUpperCase();

  return (
    <div className="hdr">
      {/* Profile zone */}
      <div className="profile-wrap">
        <div className="avatar-ring">
          <div className="avatar-inner">
            {session?.photo
              ? <img src={session.photo} alt={session?.name} />
              : <span style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 14 }}>{initials(session?.name)}</span>}
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-name">{session?.name}</div>
          <div className="profile-status">
            <div className="status-dot" />
            <div className="profile-role" style={{ color: "var(--t3)", fontSize: 11 }}>{session?.role} · En service</div>
          </div>
        </div>
      </div>

      <div className="hsp" />

      {/* Desktop nav buttons */}
      {session?.role === "serveur" && !activeTable && <>
        <button className={`hbtn${page === "tables" ? " on" : ""}`} onClick={() => setPage("tables")}>Tables</button>
        <button className={`hbtn${page === "kitchen_view" ? " on" : ""}`} onClick={() => setPage("kitchen_view")}>
          Cuisine {ready > 0 && <span style={{ marginLeft: 4, background: "var(--green)", color: "#000", borderRadius: "50%", width: 15, height: 15, fontSize: 9, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{ready}</span>}
        </button>
      </>}
      {session?.role === "cuisine" && <>
        <button className={`hbtn${page === "kitchen" ? " on" : ""}`} onClick={() => setPage("kitchen")}>Cuisine</button>
        <button className={`hbtn${page === "stats" ? " on" : ""}`} onClick={() => setPage("stats")}>Rapport</button>
      </>}
      {session?.role === "admin" && !activeTable && <>
        <button className={`hbtn${page === "tables" ? " on" : ""}`} onClick={() => setPage("tables")}>Tables</button>
        <button className={`hbtn${page === "kitchen" ? " on" : ""}`} onClick={() => setPage("kitchen")}>
          Cuisine {pending > 0 && <span style={{ marginLeft: 4, background: "var(--red)", color: "white", borderRadius: "50%", width: 15, height: 15, fontSize: 9, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{pending}</span>}
        </button>
        <button className={`hbtn${page === "stats" ? " on" : ""}`} onClick={() => setPage("stats")}>Stats</button>
        <button className={`hbtn${page === "admin" ? " on" : ""}`} onClick={() => setPage("admin")}>Admin</button>
      </>}
      {activeTable && (
        <button className="nav-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>Tables
        </button>
      )}

      {/* Logout button — always */}
      <button className="hbtn red" onClick={onLogoutRequest}>⏏ Fin</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LOGOUT CONFIRM MODAL
// ═══════════════════════════════════════════════════════════════════
function LogoutConfirmModal({ onConfirm, onCancel }) {
  const { session, orders, tables, kitchenTickets, menuItems, clockLog } = useApp();
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState("");

  if (!session) return null;

  // ── Données récap journée ──
  const today        = new Date().toDateString();
  const myOrders     = orders.filter(o => o.serverId === session.id);
  const todayPaid    = myOrders.filter(o => o.status === "paid" && new Date(o.paidAt || o.createdAt).toDateString() === today);
  const openOrders   = myOrders.filter(o => o.status === "open");
  const ca           = todayPaid.reduce((s, o) => s + o.items.reduce((ss, i) => { const mi = menuItems.find(m => m.id === i.menuId); return ss + (mi ? mi.price * i.qty : 0); }, 0) * 1.1, 0);
  const nbCmd        = todayPaid.length;
  const avg          = nbCmd > 0 ? ca / nbCmd : 0;

  // Tables encore occupées par ce serveur
  const myOpenTables = tables.filter(t => t.serverId === session.id && t.status !== "libre");

  // Tickets cuisine actifs pour ce serveur
  const myKitchenActive = kitchenTickets.filter(t =>
    t.serverId === session.id && (t.status === "pending" || t.status === "preparing")
  );

  // Pointage du jour
  const entry = clockLog.find(l => l.staffId === session.id && new Date(l.clockIn).toDateString() === today && !l.clockOut);
  const dur   = entry ? Date.now() - entry.clockIn : 0;
  const durH  = Math.floor(dur / 3600000);
  const durM  = Math.floor((dur % 3600000) / 60000);

  const hasAlerts  = myOpenTables.length > 0 || myKitchenActive.length > 0;
  const hasPending = myKitchenActive.length > 0;
  const hasOpenTbl = myOpenTables.length > 0;

  // Calcul montant en attente sur les tables encore ouvertes
  const pendingAmount = myOpenTables.reduce((s, tbl) => {
    const ord = orders.find(o => o.id === tbl.orderId);
    if (!ord) return s;
    return s + ord.items.reduce((ss, i) => { const mi = menuItems.find(m => m.id === i.menuId); return ss + (mi ? mi.price * i.qty : 0); }, 0) * 1.1;
  }, 0);

  // ── Vérification PIN ──
  const tap = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      if (next === session.pin) {
        onConfirm();
      } else {
        setTimeout(() => { setPin(""); setPinErr("Code PIN incorrect ❌"); }, 250);
      }
    } else setPinErr("");
  };

  return (
    <div className="overlay" style={{ zIndex: 500 }} onClick={onCancel}>
      <div className="logout-modal" onClick={e => e.stopPropagation()}>
        <div className="logout-header">
          <span className="logout-icon">⏏</span>
          <div className="logout-title">Fin de service</div>
          <div style={{ fontSize: 12, color: "var(--t2)", textAlign: "right" }}>
            <div style={{ fontWeight: 600 }}>{session.name}</div>
            <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--t3)" }}>{session.role}</div>
          </div>
        </div>

        <div className="logout-body">

          {/* ── Durée de service ── */}
          {entry && (
            <div style={{ textAlign: "center", marginBottom: 16, color: "var(--t2)", fontSize: 12 }}>
              Service commencé à <b style={{ color: "var(--t1)" }}>{new Date(entry.clockIn).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</b>
              {" · "}<b style={{ color: "var(--acc)" }}>{durH}h{String(durM).padStart(2, "0")}</b> de travail
            </div>
          )}

          {/* ── Récap chiffres ── */}
          <div className="recap-grid">
            <div className="recap-card">
              <div className="recap-lbl">CA encaissé</div>
              <div className="recap-val">{ca.toFixed(0)} <span style={{ fontSize: 14, color: "var(--t2)" }}>€</span></div>
            </div>
            <div className="recap-card">
              <div className="recap-lbl">Commandes</div>
              <div className="recap-val">{nbCmd}</div>
            </div>
            <div className="recap-card">
              <div className="recap-lbl">Ticket moyen</div>
              <div className="recap-val">{avg.toFixed(0)} <span style={{ fontSize: 14, color: "var(--t2)" }}>€</span></div>
            </div>
            <div className="recap-card">
              <div className="recap-lbl">Total à encaisser</div>
              <div className="recap-val" style={{ color: hasOpenTbl ? "var(--red)" : "var(--green)" }}>
                {pendingAmount.toFixed(0)} <span style={{ fontSize: 14, color: "var(--t2)" }}>€</span>
              </div>
            </div>
          </div>

          {/* ── Alertes tables encore ouvertes ── */}
          {hasOpenTbl && (
            <div className="alert-blk danger">
              <div className="alert-blk-ttl" style={{ color: "var(--red)" }}>
                ⚠ {myOpenTables.length} table{myOpenTables.length > 1 ? "s" : ""} avec addition non réglée
              </div>
              <div className="alert-blk-sub">
                {myOpenTables.map(t => {
                  const ord = orders.find(o => o.id === t.orderId);
                  const amt = ord ? ord.items.reduce((s, i) => { const mi = menuItems.find(m => m.id === i.menuId); return s + (mi ? mi.price * i.qty : 0); }, 0) * 1.1 : 0;
                  return (
                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                      <span>🪑 {t.name} — <span style={{ textTransform: "uppercase", fontSize: 10, color: "var(--yellow)" }}>{t.status}</span></span>
                      <b style={{ color: "var(--red)" }}>{amt.toFixed(2)} €</b>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Alertes plats en cuisine ── */}
          {hasPending && (
            <div className="alert-blk warn">
              <div className="alert-blk-ttl" style={{ color: "var(--yellow)" }}>
                🍳 {myKitchenActive.length} commande{myKitchenActive.length > 1 ? "s" : ""} encore en cuisine
              </div>
              <div className="alert-blk-sub">
                {myKitchenActive.map(t => (
                  <div key={t.id} style={{ padding: "2px 0" }}>
                    🪑 {t.tableName} — <span style={{ color: t.status === "pending" ? "var(--yellow)" : "var(--acc)" }}>
                      {t.status === "pending" ? "en attente" : "en préparation"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tout OK ── */}
          {!hasAlerts && (
            <div className="alert-blk ok">
              <div className="alert-blk-ttl" style={{ color: "var(--green)" }}>✅ Toutes les additions sont réglées</div>
              <div className="alert-blk-sub">Aucune table ouverte, aucun plat en attente.</div>
            </div>
          )}

          {/* ── Saisie PIN de confirmation ── */}
          <div className="pin-confirm">
            <div className="pin-confirm-lbl">
              {hasAlerts
                ? "⚠ Des additions sont encore en cours — confirmez quand même avec votre PIN :"
                : "Confirmez votre départ avec votre PIN :"}
            </div>
            <div className="pin-confirm-disp">
              {pin
                ? <span style={{ letterSpacing: 12 }}>{"●".repeat(pin.length)}</span>
                : <span style={{ color: "var(--t3)", fontSize: 22, letterSpacing: 8 }}>· · · ·</span>}
            </div>
            <div className="pin-confirm-grid">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} className="pin-confirm-btn" onClick={() => tap(String(n))}>{n}</button>
              ))}
              <button className="pin-confirm-btn" onClick={() => { setPin(""); setPinErr(""); }}>⌫</button>
              <button className="pin-confirm-btn" onClick={() => tap("0")}>0</button>
              <button className="pin-confirm-btn" onClick={onCancel} style={{ color: "var(--red)", fontSize: 13 }}>Annuler</button>
            </div>
            <div className="pin-err-msg">{pinErr}</div>
          </div>

          <div style={{ fontSize: 11, color: "var(--t3)", textAlign: "center" }}>
            Un rapport de service sera imprimé automatiquement à la déconnexion.
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MOBILE BOTTOM NAV BAR
// ═══════════════════════════════════════════════════════════════════
function MobileNav({ onLogoutRequest }) {
  const { session, page, setPage, kitchenTickets } = useApp();
  if (!session) return null;
  const pending = kitchenTickets.filter(t => t.status === "pending").length;
  const ready   = kitchenTickets.filter(t => t.status === "ready").length;

  const ICONS = {
    tables: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
    order:  <svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    kitchen:<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M12 6v6l4 2"/></svg>,
    stats:  <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    admin:  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
    logout: <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    view:   <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  };

  const Tab = ({ p, icon, label, badge, badgeGreen, fab }) => (
    <div
      className={`nav-item${page === p ? " active" : ""}${fab ? " fab" : ""}`}
      onClick={() => setPage(p)}
    >
      {ICONS[icon]}
      <span className="nav-lbl">{label}</span>
      {badge > 0 && <div className={`nav-bdg${badgeGreen ? " green" : ""}`}>{badge}</div>}
    </div>
  );

  return (
    <div className="bnav">
      <div className="bnav-inner">
        {session.role === "serveur" && <>
          <Tab p="tables"       icon="tables"  label="Tables" />
          <Tab p="kitchen_view" icon="view"    label="Cuisine" badge={ready} badgeGreen />
          <div className="nav-item" onClick={onLogoutRequest} style={{ color: "var(--red)" }}>
            {ICONS.logout}
            <span className="nav-lbl" style={{ color: "var(--red)" }}>Fin</span>
          </div>
        </>}
        {session.role === "cuisine" && <>
          <Tab p="kitchen" icon="kitchen" label="Cuisine" badge={pending} fab />
          <Tab p="stats"   icon="stats"   label="Rapport" />
          <div className="nav-item" onClick={onLogoutRequest}>
            {ICONS.logout}
            <span className="nav-lbl">Fin</span>
          </div>
        </>}
        {session.role === "admin" && <>
          <Tab p="tables"  icon="tables"  label="Tables" />
          <Tab p="kitchen" icon="kitchen" label="Cuisine" badge={pending} fab />
          <Tab p="stats"   icon="stats"   label="Stats" />
          <Tab p="admin"   icon="admin"   label="Admin" />
          <div className="nav-item" onClick={onLogoutRequest}>
            {ICONS.logout}
            <span className="nav-lbl">Fin</span>
          </div>
        </>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TOAST STACK
// ═══════════════════════════════════════════════════════════════════
function ToastStack() {
  const { notifications } = useApp();
  return (
    <div className="tstack">
      {notifications.map(n => <div key={n.id} className={`toast ${n.type}`}>{n.msg}</div>)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DELIVERY ORDER MODAL
// ═══════════════════════════════════════════════════════════════════
function DeliveryModal({ onClose }) {
  const { families, menuItems, availability, delivery, setDelivery, session, kitchenTickets, setKitchen } = useApp();
  const [step,   setStep]   = useState(1);
  const [type,   setType]   = useState("uber");
  const [ref,    setRef]    = useState("");
  const [cat,    setCat]    = useState(families[0]?.id || "");
  const [cart,   setCart]   = useState([]);
  const [note,   setNote]   = useState("");

  const inCart  = (id) => cart.find(c => c.id === id)?.qty || 0;
  const total   = cart.reduce((s, c) => s + c.p * c.qty, 0);
  const tc      = type === "uber" ? "#06c167" : "var(--acc)";
  const famItems = menuItems.filter(m => m.familyId === cat);
  const activeFam = families.find(f => f.id === cat);

  const addItem = (mi) => {
    const ex = cart.find(c => c.id === mi.id);
    if (ex) setCart(cart.map(c => c.id === mi.id ? { ...c, qty: c.qty + 1 } : c));
    else     setCart([...cart, { id: mi.id, nm: mi.name, p: mi.price, qty: 1 }]);
  };

  const chgQty = (id, d) => {
    setCart(cart.map(c => c.id === id ? { ...c, qty: c.qty + d } : c).filter(c => c.qty > 0));
  };

  const confirm = () => {
    if (!cart.length) return;
    const finalRef = ref.trim() || (type === "uber" ? "#" + Math.floor(Math.random() * 9000 + 1000) : "Client");
    const orderId  = `del_${Date.now()}`;
    const newDel   = {
      id: orderId, type, ref: finalRef, cart: [...cart],
      total, note, status: "pending",
      serverId: session?.id, serverName: session?.name,
      createdAt: Date.now()
    };

    const curDel = S.get("delivery", []);
    S.set("delivery", [...curDel, newDel]);

    // Envoyer en cuisine les articles qui vont en cuisine
    const curMenu  = S.get("menu", []);
    const curFams  = S.get("families", []);
    const kitItems = cart.filter(c => {
      const mi  = curMenu.find(m => m.id === c.id);
      const fam = curFams.find(f => f.id === mi?.familyId);
      return fam?.sendToKitchen;
    }).map(c => ({ menuId: c.id, qty: c.qty, name: c.nm }));

    if (kitItems.length) {
      const label  = type === "uber" ? `🟢 Uber ${finalRef}` : `🛍️ Emporter ${finalRef}`;
      const ticket = {
        id: `kt_${Date.now()}`, orderId, tableId: null, tableName: label,
        serverId: session?.id, serverName: session?.name || "Serveur",
        items: kitItems, status: "pending", notes: note, createdAt: Date.now(),
      };
      const curK = S.get("kitchen", []);
      S.set("kitchen", [...curK, ticket]);
    }
    onClose();
  };

  const GL = {
    glass:   "rgba(255,255,255,.05)",
    border:  "1px solid rgba(255,255,255,.09)",
    rad:     "var(--Rlg)",
    radSm:   "var(--Rsm)",
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div style={{ background: "rgba(14,14,22,.97)", border: "1px solid var(--border2)", borderRadius: "var(--Rxl) var(--Rxl) 0 0", width: "100%", maxWidth: 480, maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column", backdropFilter: "blur(40px)" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font2)", fontSize: 16, fontWeight: 700 }}>
            {step === 1 ? "Nouvelle commande" : (type === "uber" ? "🟢 Uber — " : "🛍️ Emporter — ") + (ref || "...")}
          </div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>

        {/* Body scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px" }}>

          {/* ── ÉTAPE 1 : type + référence ── */}
          {step === 1 && <>
            <div style={{ fontSize: 10, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 8 }}>Type de commande</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 14 }}>
              {[["uber","🟢","Uber Eats","rgba(6,193,103,.18)","rgba(6,193,103,.4)","#06c167"],
                ["emporter","🛍️","À Emporter","rgba(255,107,53,.18)","rgba(255,107,53,.4)","var(--acc)"]].map(([t,ico,lbl,bg,bc,col]) => (
                <div key={t} onClick={() => setType(t)} style={{
                  padding: 14, borderRadius: 12, border: `1px solid ${type===t?bc:"var(--border)"}`,
                  background: type===t?bg:"var(--glass)", cursor: "pointer",
                  textAlign: "center", fontSize: 13, fontWeight: 600,
                  color: type===t?col:"var(--t2)", transition: "all .15s"
                }}>
                  <div style={{ fontSize: 22, marginBottom: 5 }}>{ico}</div>{lbl}
                </div>
              ))}
            </div>

            <div style={{ fontSize: 10, color: "var(--t3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".8px" }}>
              {type === "uber" ? "Numéro de commande Uber" : "Nom du client"}
            </div>
            <input className="oinp" style={{ marginBottom: 12, width: "100%", display: "block" }}
              placeholder={type === "uber" ? "Ex: #4287" : "Prénom ou nom"}
              value={ref} onChange={e => setRef(e.target.value)}
              onKeyDown={e => e.key === "Enter" && setStep(2)}
              autoFocus
            />
            <button className="btn btn-acc" onClick={() => setStep(2)}>
              Choisir les articles →
            </button>
          </>}

          {/* ── ÉTAPE 2 : sélection articles ── */}
          {step === 2 && <>
            {/* Barre catégories scrollable */}
            <div style={{ display: "flex", gap: 7, overflowX: "auto", marginBottom: 10, paddingBottom: 2 }}>
              {families.map(f => (
                <div key={f.id} onClick={() => setCat(f.id)} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0,
                  border: `1px solid ${cat===f.id?(f.color||"var(--acc)")+"55":"var(--border)"}`,
                  background: cat===f.id?(f.color||"var(--acc)")+"18":"var(--glass)",
                  fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all .14s",
                  color: cat===f.id?"white":"var(--t2)"
                }}>
                  <span style={{ fontSize: 13 }}>{f.icon}</span>{f.name}
                </div>
              ))}
            </div>

            {/* Grille articles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7, maxHeight: 210, overflowY: "auto", marginBottom: 12 }}>
              {famItems.map(item => {
                const unavail = availability[item.id] === true || (item.stock !== null && item.stock <= 0);
                const cnt     = inCart(item.id);
                return (
                  <div key={item.id} onClick={() => !unavail && addItem(item)}
                    style={{
                      background: "var(--glass)", border: `1px solid ${unavail?"var(--border)":(families.find(f=>f.id===item.familyId)?.color||"var(--acc)")+"44"}`,
                      borderRadius: 11, padding: "9px 7px", cursor: unavail?"not-allowed":"pointer",
                      opacity: unavail?0.35:1, position: "relative", textAlign: "center", transition: "all .13s"
                    }}>
                    {cnt > 0 && (
                      <div style={{ position: "absolute", top: 5, right: 5, background: tc, color: type==="uber"?"#000":"white", fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cnt}</div>
                    )}
                    <div style={{ fontSize: 16, marginBottom: 3 }}>{activeFam?.icon || "🍽"}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, lineHeight: 1.2, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: tc }}>{item.price.toFixed(2)} €</div>
                  </div>
                );
              })}
            </div>

            {/* Panier */}
            {cart.length > 0 && (
              <div style={{ background: "var(--glass)", border: "1px solid var(--border)", borderRadius: 12, padding: 11, marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--t2)", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 8 }}>
                  Commande — {cart.length} article{cart.length > 1 ? "s" : ""}
                </div>
                {cart.map(c => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ flex: 1, fontSize: 11, fontWeight: 600 }}>{c.nm}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <div className="qb" style={{ width: 20, height: 20, fontSize: 12 }} onClick={() => chgQty(c.id, -1)}>−</div>
                      <div className="qv" style={{ fontSize: 11 }}>{c.qty}</div>
                      <div className="qb" style={{ width: 20, height: 20, fontSize: 12 }} onClick={() => chgQty(c.id, +1)}>+</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, fontFamily: "var(--font2)", color: tc, minWidth: 40, textAlign: "right" }}>{(c.p*c.qty).toFixed(2)}€</div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 9, paddingTop: 7, borderTop: `1px solid ${tc}33` }}>
                  <span style={{ fontSize: 12, color: "var(--t3)" }}>Total</span>
                  <span style={{ fontFamily: "var(--font2)", fontSize: 18, fontWeight: 700, color: tc }}>{total.toFixed(2)} €</span>
                </div>
              </div>
            )}

            {/* Note */}
            <input className="oinp" placeholder="Note / instructions..." value={note} onChange={e => setNote(e.target.value)} style={{ marginBottom: 10, width: "100%", display: "block" }} />

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-sec" style={{ flex: 1 }} onClick={() => setStep(1)}>← Retour</button>
              <button
                className="btn btn-acc"
                style={{ flex: 2, background: type==="uber"?"linear-gradient(135deg,#06c167,#00e676)":"var(--acc-g)", color: type==="uber"?"#000":"white" }}
                disabled={!cart.length}
                onClick={confirm}>
                🍳 Envoyer en cuisine
              </button>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

function TablePlan({ onSelectTable }) {
  const { myTables, openTable, orders, staff, menuItems, session, delivery, setDelivery } = useApp();
  const [now,         setNow]         = useState(Date.now());
  const [coversModal, setCoversModal] = useState(null);
  const [covers,      setCovers]      = useState("2");
  const [showDelivery,setShowDelivery]= useState(false);

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(t); }, []);

  const handleTable = (table) => {
    if (table.status === "libre") setCoversModal(table.id);
    else if (session?.role === "admin" || table.serverId === session?.id) onSelectTable(table.id);
  };

  const confirmOpen = () => {
    openTable(coversModal, parseInt(covers)||2);
    setTimeout(() => onSelectTable(coversModal), 60);
    setCoversModal(null);
  };

  const statusColors = { libre:"var(--t3)", "en cours":"var(--acc)", "envoyé cuisine":"var(--yellow)", "prêt":"var(--green)" };
  const activeDelivery = delivery.filter(d => d.status !== "done");

  return (
    <div className="plan">
      <div className="ptoolbar">
        <div className="ptitle">Plan des tables</div>
        <div style={{ marginLeft:"auto",display:"flex",gap:7,flexWrap:"wrap" }}>
          {["libre","en cours","envoyé cuisine","prêt"].map(s => (
            <span key={s} style={{ fontSize:10,background:"var(--glass)",border:"1px solid var(--border)",borderRadius:5,padding:"3px 8px",color:statusColors[s] }}>
              {myTables.filter(t=>t.status===s).length} {s}
            </span>
          ))}
        </div>
      </div>

      {/* ── TABLES section ── */}
      <div className="plan-section-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
        Tables
        <span className="stag" style={{ background:"var(--glass2)",color:"var(--t3)" }}>{myTables.length}</span>
      </div>

      {/* Grille petits carreaux */}
      <div className="tgrid">
        {myTables.map((table, i) => {
          const order   = orders.find(o => o.id === table.orderId);
          const total   = order ? orderTot(order.items, menuItems) : 0;
          const elapsed = table.openedAt ? now - table.openedAt : 0;
          const srv     = staff.find(s => s.id === table.serverId);
          const sc      = table.status.replace(/ /g,"-");
          return (
            <div key={table.id} className={`tcrd ${sc}`}
              style={{ animationDelay:`${i*.025}s` }}
              onClick={() => handleTable(table)}>
              {srv && <div className="tsdot" style={{ background:srv.color }} />}
              <div className="tnum">{table.name.replace("Table ","T")}</div>
              <span className={`tsb sb-${sc}`}>{
                table.status === "libre" ? "libre" :
                table.status === "en cours" ? "ouvert" :
                table.status === "envoyé cuisine" ? "cuisine" :
                table.status === "prêt" ? "prêt" : table.status
              }</span>
              {table.status !== "libre" && <>
                <div className={`ttmr ${tClass(elapsed)}`}>{fmtT(elapsed)}</div>
                <div className="tamt">{total.toFixed(0)}€</div>
              </>}
            </div>
          );
        })}
      </div>

      {/* ── LIVRAISONS section ── */}
      <div className="plan-section-title" style={{ marginTop:20 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2 6.3-6.4 2.1 2-6.3 6.4-2.1z"/></svg>
        Commandes à Emporter & Uber
        {activeDelivery.length > 0 && <span className="stag" style={{ background:"rgba(6,193,103,.15)",color:"#06c167" }}>{activeDelivery.length} active{activeDelivery.length>1?"s":""}</span>}
      </div>

      <div className="delivery-grid">
        {activeDelivery.map(d => {
          const elapsed = now - d.createdAt;
          const totalAmt = d.items.reduce((s,i) => { const mi=menuItems.find(m=>m.id===i.menuId); return s+(mi?mi.price*i.qty:0); }, 0);
          const tc = d.type === "uber" ? "#06c167" : "var(--acc)";
          return (
            <div key={d.id} className={`delivery-card ${d.type} ${d.status}`}>
              <div className="dc-header">
                <div className={`dc-icon ${d.type}`}>{d.type==="uber"?"🟢":"🛍️"}</div>
                <div className="dc-ref">{d.ref}</div>
                <div className="dc-status" style={{
                  background: d.status==="ready"?"rgba(0,229,160,.15)":d.status==="envoyé cuisine"?"rgba(255,209,102,.15)":"rgba(255,107,53,.12)",
                  color: d.status==="ready"?"var(--green)":d.status==="envoyé cuisine"?"var(--yellow)":"var(--acc)"
                }}>
                  {d.status==="pending"?"⏳ En attente":d.status==="envoyé cuisine"?"🍳 En cuisine":d.status==="ready"?"✅ Prêt":""}
                </div>
              </div>
              <div className="dc-items">{d.items.map(i=>{ const mi=menuItems.find(m=>m.id===i.menuId); return mi?`${i.qty}× ${mi.name}`:null; }).filter(Boolean).join(" · ")}</div>
              {d.note && <div style={{ fontSize:10,color:"var(--yellow)",marginTop:2 }}>📝 {d.note}</div>}
              <div className="dc-footer">
                <div className="dc-amt" style={{ color:tc }}>{totalAmt.toFixed(2)} €</div>
                <div className="dc-tmr">{fmtT(elapsed)}</div>
                <button onClick={() => setDelivery(delivery.map(x => x.id===d.id ? {...x,status:"done"} : x))}
                  style={{ fontSize:10,padding:"3px 8px",borderRadius:6,background:"var(--glass2)",border:"1px solid var(--border)",color:"var(--t2)",cursor:"pointer" }}>
                  ✓ Clôturer
                </button>
              </div>
            </div>
          );
        })}

        {/* Bouton nouvelle commande */}
        <button className="btn-new-delivery" onClick={() => setShowDelivery(true)}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Nouvelle commande Uber / Emporter
        </button>
      </div>

      {/* Modal couverts */}
      {coversModal && (
        <div className="overlay" onClick={()=>setCoversModal(null)}>
          <div className="modal" style={{ maxWidth:310 }} onClick={e=>e.stopPropagation()}>
            <div className="mhdr">
              <div className="mtitle">Ouvrir {myTables.find(t=>t.id===coversModal)?.name}</div>
              <button className="mclose" onClick={()=>setCoversModal(null)}>✕</button>
            </div>
            <div className="mbody">
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:12,color:"var(--t2)",marginBottom:8 }}>Nombre de couverts</div>
                <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
                  {[1,2,3,4,5,6,7,8,10,12].map(n => (
                    <div key={n} onClick={()=>setCovers(String(n))} style={{ width:38,height:38,background:covers===String(n)?"var(--acc)":"var(--glass2)",border:`1px solid ${covers===String(n)?"var(--acc)":"var(--border)"}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:covers===String(n)?"white":"var(--t1)",fontWeight:700,fontSize:14 }}>{n}</div>
                  ))}
                </div>
              </div>
              <button className="btn btn-acc" onClick={confirmOpen}>✓ Ouvrir la table</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal livraison */}
      {showDelivery && <DeliveryModal onClose={()=>setShowDelivery(false)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ITEM OPTIONS
// ═══════════════════════════════════════════════════════════════════
function ItemOptionsModal({ item, onConfirm, onClose }) {
  const { menuItems } = useApp();
  const [cuisson, setCuisson] = useState("");
  const [accompagnement, setAccompagnement] = useState("");
  const [sans, setSans] = useState([]);
  const [note, setNote] = useState("");
  const showCuisson = FAMILIES_WITH_CUISSON.has(item.familyId);
  const showAccomp = FAMILIES_WITH_ACCOMP.has(item.familyId);
  const accompChoices = menuItems.filter(m => m.familyId === "fam_garnitures");
  return (
    <div className="overlay" onClick={onClose}>
      <div className="omods" onClick={e => e.stopPropagation()}>
        <div className="omtitle">{item.name}</div>
        {showCuisson && (
          <div className="orow"><div className="olbl">Cuisson</div><div className="chips">{CUISSONS.map(c => <span key={c} className={`chip${cuisson === c ? " on" : ""}`} onClick={() => setCuisson(c === cuisson ? "" : c)}>{c}</span>)}</div></div>
        )}
        {showAccomp && (
          <div className="orow">
            <div className="olbl">Accompagnement offert</div>
            <div className="chips">
              {accompChoices.map(a => (
                <span key={a.id} className={`chip${accompagnement === a.name ? " on" : ""}`} onClick={() => setAccompagnement(accompagnement === a.name ? "" : a.name)}>
                  {a.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="orow"><div className="olbl">Sans...</div><div className="chips">{SANS_OPT.map(i => <span key={i} className={`chip${sans.includes(i) ? " on" : ""}`} onClick={() => setSans(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i])}>{i}</span>)}</div></div>
        <div className="orow"><div className="olbl">Note</div><input className="oinp" placeholder="Instructions..." value={note} onChange={e => setNote(e.target.value)} /></div>
        <div style={{ display: "flex", gap: 9, marginTop: 8 }}>
          <button className="btn btn-sec" style={{ flex: 1 }} onClick={onClose}>Annuler</button>
          <button className="btn btn-acc" style={{ flex: 1 }} onClick={() => onConfirm({ cuisson, accompagnement, sans, note })}>Ajouter</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BILL MODAL
// ═══════════════════════════════════════════════════════════════════
function BillModal({ table, order, onClose }) {
  const { closeTable, menuItems } = useApp();
  const ht = orderTot(order?.items || [], menuItems);
  const tva = ht * 0.1;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="mhdr"><div className="mtitle">Addition — {table.name}</div><button className="mclose" onClick={onClose}>✕</button></div>
        <div className="mbody">
          <div className="bitems">
            {(order?.items || []).map((item, i) => {
              const mi = menuItems.find(m => m.id === item.menuId);
              if (!mi) return null;
              return <div key={i} className="bi"><span className="blbl">{item.qty}× {mi.name}{item.options?.cuisson ? ` (${item.options.cuisson})` : ""}{item.options?.accompagnement ? ` — Accomp. offert: ${item.options.accompagnement}` : ""}</span><span className="bval">{(mi.price * item.qty).toFixed(2)} €</span></div>;
            })}
            <div className="bi sub"><span className="blbl">Total HT</span><span className="bval">{ht.toFixed(2)} €</span></div>
            <div className="bi"><span className="blbl">TVA 10%</span><span className="bval">{tva.toFixed(2)} €</span></div>
            <div className="bi tot"><span>TOTAL TTC</span><span>{(ht + tva).toFixed(2)} €</span></div>
          </div>
          <div style={{ fontSize: 11, color: "var(--t3)", textAlign: "center", marginBottom: 10 }}>Impression automatique à la clôture</div>
          <div className="paybts">
            {[["💳","Carte"],["💵","Espèces"],["📱","Lydia"],["🔄","Mixte"]].map(([ico, label]) => (
              <button key={label} className="paybt" onClick={() => { closeTable(table.id, label); onClose(); }}>
                <span className="payico">{ico}</span>{label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ORDER SCREEN
// ═══════════════════════════════════════════════════════════════════
function OrderScreen({ tableId }) {
  const { tables, orders, updateOrder, sendToKitchen, availability, families, menuItems, kitchenTickets, session, cancelKitchenItem } = useApp();
  const table = tables.find(t => t.id === tableId);
  const order = orders.find(o => o.id === table?.orderId);
  const [cat, setCat] = useState(families[0]?.id || "");
  const [showBill, setShowBill] = useState(false);
  const [longItem, setLongItem] = useState(null);
  const [stockAlert, setStockAlert] = useState(null);
  const pressTimer = useRef(null);
  const alertTimer = useRef(null);

  if (!table || !order) return null;

  const items = order.items || [];
  const total = orderTot(items, menuItems);
  const myTickets = kitchenTickets.filter(t => t.orderId === order.id);
  const pendingMenuIds = new Set(myTickets.filter(t => t.status === "pending").flatMap(t => t.items.map(i => i.menuId)));
  const inCartQty = (menuId) => items.filter(i => i.menuId === menuId).reduce((s, i) => s + i.qty, 0);

  const showStockAlert = (mi, remaining) => {
    clearTimeout(alertTimer.current);
    setStockAlert({ name: mi.name, remaining });
    alertTimer.current = setTimeout(() => setStockAlert(null), 3500);
  };

  const addItem = (mi, opts = {}) => {
    if (mi.stock !== null) {
      const qty = inCartQty(mi.id);
      if (qty >= mi.stock) { showStockAlert(mi, mi.stock); return; }
    }
    const hasOpts = opts.cuisson || opts.accompagnement || opts.note || (opts.sans?.length > 0);
    const existing = !hasOpts && items.find(i => i.menuId === mi.id);
    if (existing) updateOrder(order.id, { items: items.map(i => i === existing ? { ...i, qty: i.qty + 1 } : i) });
    else updateOrder(order.id, { items: [...items, { menuId: mi.id, qty: 1, options: opts }] });
  };

  const chgQty = (idx, d) => {
    if (d > 0) {
      const it = items[idx];
      if (it) {
        const mi = menuItems.find(m => m.id === it.menuId);
        if (mi?.stock !== null && inCartQty(mi.id) >= mi.stock) { showStockAlert(mi, mi.stock); return; }
      }
    }
    const next = items.map((it, ix) => ix === idx ? { ...it, qty: it.qty + d } : it).filter(it => it.qty > 0);
    updateOrder(order.id, { items: next });
  };

  const startLong = (item) => { pressTimer.current = setTimeout(() => setLongItem(item), 600); };
  const endLong = () => clearTimeout(pressTimer.current);

  const famItems = menuItems.filter(m => m.familyId === cat);
  const activeFam = families.find(f => f.id === cat);

  // Couleur de fond dynamique pour la pill active
  const activePillStyle = (fam) => {
    const c = fam?.color || "#ff6b35";
    const hex = c.replace("#","");
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    return { background: `rgba(${r},${g},${b},.22)`, borderColor: `rgba(${r},${g},${b},.45)` };
  };

  return (
    <div className="oscreen">

      {/* Stock alert */}
      {stockAlert && (
        <div className="stock-alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <div style={{ fontWeight:700, color:"var(--red)", fontSize:13, marginBottom:2 }}>Stock insuffisant — {stockAlert.name}</div>
            <div style={{ fontSize:11, color:"var(--t2)" }}>
              {stockAlert.remaining === 0 ? "Article épuisé — aucune unité disponible" : `Il reste ${stockAlert.remaining} unité${stockAlert.remaining > 1 ? "s" : ""} en stock`}
            </div>
          </div>
          <button onClick={() => setStockAlert(null)} style={{ background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:16,padding:"0 0 0 6px",lineHeight:1 }}>✕</button>
        </div>
      )}

      {/* Kitchen status bar */}
      {myTickets.length > 0 && (
        <div className="kitbar">
          {myTickets.map(t => (
            <div key={t.id} className="kbitem">
              <div className="kbdot" style={{ background: t.status === "pending" ? "var(--yellow)" : t.status === "preparing" ? "var(--acc)" : "var(--green)" }} />
              <span style={{ color: t.status === "ready" ? "var(--green)" : t.status === "preparing" ? "var(--acc)" : "var(--yellow)", fontSize:11 }}>
                {t.status === "pending" ? "⏳ En attente" : t.status === "preparing" ? "🔥 En préparation" : "✅ Prêt à servir"}
                <span style={{ color:"var(--t3)", marginLeft:4, fontSize:10 }}>{fmtT(Date.now() - t.createdAt)}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── CATÉGORIES horizontales défilantes ── */}
      <div className="ocats">
        {families.map(f => {
          const isOn = cat === f.id;
          const fStyle = isOn ? activePillStyle(f) : {};
          return (
            <div key={f.id} className={`catpill${isOn ? " on" : ""}`} style={fStyle} onClick={() => setCat(f.id)}>
              {/* Icône carrée colorée */}
              <div className="cpico" style={{ background: isOn ? (f.color || "var(--acc)") : "var(--glass2)" }}>
                {f.icon}
              </div>
              <span className="cplbl">{f.name}</span>
              {f.sendToKitchen && (
                <svg width="8" height="8" viewBox="0 0 8 8" style={{ opacity:.5 }}>
                  <circle cx="4" cy="4" r="3" fill="var(--acc)"/>
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* ── ZONE PRINCIPALE : menu + panier ── */}
      <div className="omain">

        {/* Grille des articles */}
        <div className="marea">
          <div className="mcatttl">
            <span style={{ fontSize:16 }}>{activeFam?.icon}</span>
            {activeFam?.name}
            {activeFam?.sendToKitchen && <span className="kitbadge">→ Cuisine</span>}
          </div>
          <div className="mgrid">
            {famItems.map(item => {
              const unavail   = availability[item.id] === true;
              const outOfStock= item.stock !== null && item.stock <= 0;
              const cartQty   = inCartQty(item.id);
              const cartFull  = item.stock !== null && cartQty >= item.stock;
              const lowStock  = item.stock !== null && item.stock > 0 && item.stock <= 3;
              const blocked   = unavail || outOfStock || cartFull;
              const remaining = item.stock !== null ? item.stock - cartQty : null;
              // Couleur de bordure selon la famille
              const fam = families.find(f => f.id === item.familyId);
              const famColor = fam?.color || "var(--border)";
              return (
                <div key={item.id}
                  className={`mitem${blocked ? " unavail" : ""}`}
                  style={{ borderColor: blocked ? "rgba(255,71,87,.3)" : `${famColor}44` }}
                  onMouseDown={() => !blocked && startLong(item)}
                  onMouseUp={endLong}
                  onTouchStart={() => !blocked && startLong(item)}
                  onTouchEnd={endLong}
                  onClick={() => {
                    if (blocked) return;
                    if (itemNeedsOptionsModal(item)) setLongItem(item);
                    else addItem(item);
                  }}>
                  {/* Zone photo */}
                  <div className="mitem-photo" style={{ borderBottom: `1px solid ${famColor}22` }}>
                    {item.photo
                      ? <img src={item.photo} alt={item.name} />
                      : <div className="mitem-photo-empty" style={{ background: `${famColor}12` }}>{fam?.icon || "🍽"}</div>}
                    {cartQty > 0 && <div className="ibadge">{cartQty}</div>}
                  </div>
                  {/* Corps */}
                  <div className="mitem-body">
                    <div className="iname">{item.name}</div>
                    <div className="idesc">{item.desc}</div>
                    <div className="iprice-row">
                      <div className="iprice" style={{ color: famColor }}>{item.price.toFixed(2)} €</div>
                      {item.stock !== null && (
                        <div className={`istk${outOfStock||cartFull?" out":lowStock?" low":""}`}>
                          {outOfStock ? "Épuisé" : cartFull ? `Max(${item.stock})` : remaining <= 3 ? `⚠ ${remaining}` : remaining}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PANIER — fixe à droite ── */}
        <div className="cart">
          <div className="chdr">
            <div className="ctitle">Commande</div>
            <div className="ctbadge">{table.name}</div>
            {table.covers > 0 && <span style={{ fontSize:10, color:"var(--t3)" }}>👤{table.covers}</span>}
          </div>

          {items.length === 0
            ? <div className="cempty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                <span style={{ fontSize:11 }}>Panier vide</span>
              </div>
            : <div className="citems">
                {items.map((item, idx) => {
                  const mi = menuItems.find(m => m.id === item.menuId);
                  if (!mi) return null;
                  const isPending   = pendingMenuIds.has(item.menuId);
                  const alreadySent = order.sentItems || {};
                  const qtySent     = alreadySent[item.menuId] || 0;
                  const qtyNew      = item.qty - qtySent;
                  const fam         = families.find(f => f.id === mi.familyId);
                  const goesToKit   = fam?.sendToKitchen;
                  const allSent     = goesToKit && qtySent >= item.qty && qtySent > 0;
                  return (
                    <div key={idx} className={`citem${isPending ? " kp" : ""}`}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div className="ciname">{mi.name}</div>
                        {item.options?.cuisson && <div className="ciopts">🔥 {item.options.cuisson}</div>}
                        {item.options?.accompagnement && <div className="ciopts" style={{ color:"var(--green)" }}>🍽 Accomp. offert: {item.options.accompagnement}</div>}
                        {item.options?.sans?.length > 0 && <div className="ciopts">⚠ Sans: {item.options.sans.join(", ")}</div>}
                        {item.options?.note && <div className="ciopts" style={{ color:"var(--yellow)" }}>📝 {item.options.note}</div>}
                        {goesToKit && allSent && <div className="ciopts" style={{ color:"var(--green)" }}>✅ Envoyé</div>}
                        {goesToKit && qtyNew > 0 && qtySent > 0 && <div className="ciopts" style={{ color:"var(--acc)" }}>✅ {qtySent} · <span style={{ color:"var(--yellow)" }}>+{qtyNew} à envoyer</span></div>}
                        {goesToKit && qtyNew > 0 && qtySent === 0 && isPending && <div className="ciopts" style={{ color:"var(--yellow)" }}>⏳ En cuisine</div>}
                      </div>
                      <div className="qc">
                        <div className="qb" onClick={() => chgQty(idx, -1)}>−</div>
                        <div className="qv">{item.qty}</div>
                        <div className="qb" onClick={() => chgQty(idx, +1)}>+</div>
                      </div>
                      <div className="ciprice">{(mi.price * item.qty).toFixed(2)}€</div>
                    </div>
                  );
                })}
              </div>
          }

          <div className="cnote">
            <textarea placeholder="Note cuisine..." value={order.notes} onChange={e => updateOrder(order.id, { notes: e.target.value })} />
          </div>

          <div className="cfoot">
            <div className="ctot"><span className="ctotl">Total</span><span className="ctota">{total.toFixed(2)} €</span></div>
            {(() => {
              const sent = order.sentItems || {};
              const delta = items.filter(i => { const f=families.find(f=>f.id===menuItems.find(m=>m.id===i.menuId)?.familyId); return f?.sendToKitchen && i.qty > (sent[i.menuId]||0); });
              const isComplement = Object.keys(sent).length > 0;
              const hasNew = delta.length > 0;
              const cnt = delta.reduce((s,i)=>s+(i.qty-(sent[i.menuId]||0)),0);
              return (
                <button className="btn btn-kitch" disabled={!hasNew} onClick={() => sendToKitchen(order.id, table.name)}>
                  {isComplement && hasNew ? `🍳 Complément (+${cnt})` : hasNew ? "🍳 Envoyer en cuisine" : "✅ Déjà envoyé"}
                </button>
              );
            })()}
            <button className="btn btn-green" onClick={() => setShowBill(true)}>🧾 Addition</button>
          </div>
        </div>
      </div>

      {longItem && <ItemOptionsModal item={longItem} onConfirm={opts => { addItem(longItem, opts); setLongItem(null); }} onClose={() => setLongItem(null)} />}
      {showBill && <BillModal table={table} order={order} onClose={() => setShowBill(false)} />}
    </div>
  );
}

function Kitchen() {
  const { kitchenTickets, updateTicket, cancelKitchenItem, session } = useApp();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 10000); return () => clearInterval(t); }, []);

  const pending = kitchenTickets.filter(t => t.status === "pending");
  const preparing = kitchenTickets.filter(t => t.status === "preparing");
  const ready = kitchenTickets.filter(t => t.status === "ready");
  const veryLate = pending.some(t => (now - t.createdAt) > 25 * 60000);

  const renderTicket = (ticket, col) => {
    const elapsed = now - ticket.createdAt;
    const elMin = Math.floor(elapsed / 60000);
    const isNew = elapsed < 90000;
    const isLate = elMin > 25;
    const isWarn = elMin > 15 && !isLate;
    return (
      <div key={ticket.id} className={`ktick${isNew ? " newt" : ""}${isLate ? " verylate" : ""}`}>
        <div className="kthdr">
          <div>
            <div className="kttbl">{ticket.tableName}</div>
            <div style={{ fontSize: 10, color: "var(--t2)", marginTop: 1 }}>👤 {ticket.serverName}</div>
            {ticket.isComplement && (
              <div style={{ fontSize: 9, fontWeight: 700, color: "var(--acc)", background: "var(--acc-d)", border: "1px solid var(--acc)", borderRadius: 4, padding: "1px 6px", marginTop: 3, display: "inline-block", letterSpacing: ".5px", textTransform: "uppercase" }}>
                ➕ Complément
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div className={`kttm${isLate ? " late" : isWarn ? " warn" : ""}`}>{fmtT(elapsed)}</div>
            {isLate && <div style={{ fontSize: 9, color: "var(--red)", fontWeight: 700 }}>⚠ RETARD</div>}
          </div>
        </div>
        <div className="ktitems">
          {ticket.items.map((item, i) => (
            <div key={i} className="ktitem">
              <span className="ktqty">{item.qty}×</span>
              <div style={{ flex: 1 }}>
                <span>{item.name}</span>
                {item.options?.cuisson && <span style={{ color: "var(--acc)", fontSize: 10 }}> — {item.options.cuisson}</span>}
                {item.options?.accompagnement && <div style={{ fontSize: 10, color: "var(--green)" }}>🍽 Accomp. offert: {item.options.accompagnement}</div>}
                {item.options?.sans?.length > 0 && <div style={{ fontSize: 10, color: "var(--yellow)" }}>⚠ Sans: {item.options.sans.join(", ")}</div>}
                {item.options?.note && <div style={{ fontSize: 10, color: "var(--yellow)" }}>📝 {item.options.note}</div>}
                {/* Cancel only in pending col and only if cuisine or admin */}
                {col === "pending" && (session?.role === "cuisine" || session?.role === "admin") && (
                  <span className="ktcancel" onClick={() => cancelKitchenItem(ticket.id, item.menuId)}>✕ Annuler</span>
                )}
              </div>
            </div>
          ))}
        </div>
        {ticket.notes && <div className="ktnote">📝 {ticket.notes}</div>}
        {/* Action buttons — cuisine only */}
        {col === "pending" && <button className="kbt kbt-prep" onClick={() => updateTicket(ticket.id, "preparing")}>▶ En préparation</button>}
        {col === "preparing" && <button className="kbt kbt-rdy" onClick={() => updateTicket(ticket.id, "ready")}>✓ Prêt à servir</button>}
        {col === "ready" && <button className="kbt kbt-srv" onClick={() => updateTicket(ticket.id, "served")}>🍽 SERVI — Supprimer</button>}
      </div>
    );
  };

  return (
    <div className="kitchen">
      {veryLate && <div className="alert-band">⚠ ALERTE — Commandes en attente depuis plus de 25 min !</div>}
      <div className="khdr">
        <div className="ktitle">🍳 CUISINE</div>
        <div style={{ color: "var(--t2)", fontSize: 11 }}>Temps réel · Impression automatique</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, fontSize: 11, flexWrap: "wrap" }}>
          <span style={{ color: "var(--yellow)" }}>⏳ {pending.length} en attente</span>
          <span style={{ color: "var(--acc)" }}>🔥 {preparing.length} en prépa</span>
          <span style={{ color: "var(--green)" }}>✅ {ready.length} prêts</span>
        </div>
      </div>
      <div className="kcols">
        {[["cp","⏳ En attente",pending,"pending"],["cprep","🔥 En préparation",preparing,"preparing"],["crdy","✅ Prêt à servir",ready,"ready"]].map(([cls, title, list, col]) => (
          <div key={col} className={`kcol ${cls}`}>
            <div className="kchdr">
              <div className="kctitle">{title}</div>
              <div className="kccnt" style={{ color: list.length > 0 ? (col === "pending" ? "var(--yellow)" : col === "preparing" ? "var(--acc)" : "var(--green)") : "var(--t3)" }}>{list.length}</div>
            </div>
            <div className="kticks">{list.map(t => renderTicket(t, col))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// KITCHEN READ-ONLY — serveur role (view only, no actions)
// ═══════════════════════════════════════════════════════════════════
function KitchenReadOnly() {
  const { kitchenTickets, session } = useApp();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(t); }, []);

  const pending = kitchenTickets.filter(t => t.status === "pending");
  const preparing = kitchenTickets.filter(t => t.status === "preparing");
  const ready = kitchenTickets.filter(t => t.status === "ready");

  const renderROTicket = (ticket) => {
    const elapsed = now - ticket.createdAt;
    const isLate = elapsed > 25 * 60000;
    const isMine = ticket.serverId === session?.id;
    const isReady = ticket.status === "ready";
    return (
      <div key={ticket.id} className={`kro-tick${isMine ? " mine" : ""}${isReady ? " ready" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
          <div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 17, fontWeight: 700 }}>{ticket.tableName}</div>
            <div style={{ fontSize: 10, color: "var(--t2)", marginTop: 1 }}>👤 {ticket.serverName}</div>
            {ticket.isComplement && (
              <div style={{ fontSize: 9, fontWeight: 700, color: "var(--acc)", marginTop: 2 }}>➕ Complément</div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: isLate ? "var(--red)" : "var(--t3)", fontWeight: isLate ? 700 : 400 }}>{fmtT(elapsed)}</div>
            {isReady && <div style={{ fontSize: 9, color: "var(--green)", fontWeight: 700, marginTop: 2 }}>✅ PRÊT</div>}
            {isLate && !isReady && <div style={{ fontSize: 9, color: "var(--red)", fontWeight: 700 }}>⚠ RETARD</div>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {ticket.items.map((item, i) => (
            <div key={i} style={{ fontSize: 11, color: "var(--t1)", display: "flex", gap: 5 }}>
              <span style={{ color: "var(--acc)", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: 13, minWidth: 18 }}>{item.qty}×</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        {isMine && <div style={{ marginTop: 6, fontSize: 9, color: "var(--acc)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>● Ma commande</div>}
      </div>
    );
  };

  return (
    <div className="kro">
      <div className="kro-banner">
        <div className="kro-title">👁 ÉTAT CUISINE</div>
        <div className="kro-badge">Lecture seule</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, fontSize: 11 }}>
          <span style={{ color: "var(--yellow)" }}>⏳ {pending.length}</span>
          <span style={{ color: "var(--acc)" }}>🔥 {preparing.length}</span>
          <span style={{ color: "var(--green)" }}>✅ {ready.length} prêts</span>
        </div>
      </div>
      <div className="kro-cols">
        {[["⏳ En attente", pending, "var(--t2)"], ["🔥 En préparation", preparing, "var(--yellow)"], ["✅ Prêt à servir", ready, "var(--green)"]].map(([title, list, color]) => (
          <div key={title} className="kro-col">
            <div className="kro-chdr">
              <div className="kro-ctitle" style={{ color }}>{title}</div>
              <div className="kccnt" style={{ color: list.length > 0 ? color : "var(--t3)" }}>{list.length}</div>
            </div>
            <div className="kro-tickets">{list.map(renderROTicket)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════════
function Stats() {
  const { orders, menuItems, staff, session, clockLog } = useApp();
  const today = new Date().toDateString();
  const paid = orders.filter(o => o.status === "paid" && new Date(o.paidAt || o.createdAt).toDateString() === today);
  const myOrders = session?.role === "admin" ? paid : paid.filter(o => o.serverId === session?.id);
  const ca = myOrders.reduce((s, o) => s + orderTot(o.items, menuItems) * 1.1, 0);
  const avg = myOrders.length > 0 ? ca / myOrders.length : 0;

  const counts = {};
  myOrders.forEach(o => o.items.forEach(i => { const mi = menuItems.find(m => m.id === i.menuId); if (mi) { if (!counts[mi.id]) counts[mi.id] = { name: mi.name, qty: 0, rev: 0 }; counts[mi.id].qty += i.qty; counts[mi.id].rev += mi.price * i.qty * 1.1; } }));
  const top10 = Object.values(counts).sort((a, b) => b.qty - a.qty).slice(0, 10);

  const todayLog = clockLog.filter(l => new Date(l.clockIn).toDateString() === today);
  const srvStats = session?.role === "admin"
    ? staff.filter(s => s.role === "serveur" && s.active).map(s => {
        const sOrds = paid.filter(o => o.serverId === s.id);
        const sCa = sOrds.reduce((sum, o) => sum + orderTot(o.items, menuItems) * 1.1, 0);
        const online = !!todayLog.find(l => l.staffId === s.id && !l.clockOut);
        return { ...s, orders: sOrds.length, ca: sCa, online };
      })
    : [];

  return (
    <div className="spg">
      <div className="stitle">{session?.role === "admin" ? "📊 Rapport global du jour" : `📋 Mon service — ${session?.name}`}</div>
      <div className="sgrid">
        <div className="scrd"><div className="slbl">CA TTC</div><div className="sval">{ca.toFixed(0)}<span className="sunit"> €</span></div></div>
        <div className="scrd"><div className="slbl">Commandes</div><div className="sval">{myOrders.length}</div></div>
        <div className="scrd"><div className="slbl">Ticket moyen</div><div className="sval">{avg.toFixed(0)}<span className="sunit"> €</span></div></div>
        {session?.role === "admin" && <div className="scrd"><div className="slbl">Staff en service</div><div className="sval">{todayLog.filter(l => !l.clockOut).length}</div></div>}
      </div>

      {srvStats.length > 0 && <>
        <div className="stitle">👥 Activité serveurs</div>
        {srvStats.map(s => (
          <div key={s.id} className="srvrow">
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.online ? "var(--green)" : "var(--t3)" }} />
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: s.color }} />
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{s.name}</div>
            <span style={{ fontSize: 11, color: "var(--t2)", background: "var(--bg3)", padding: "2px 8px", borderRadius: 20 }}>{s.orders} cmd</span>
            <span style={{ fontSize: 11, color: "var(--acc)", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>{s.ca.toFixed(0)} €</span>
            {s.online && <span style={{ fontSize: 9, color: "var(--green)", background: "var(--green-d)", borderRadius: 4, padding: "2px 6px", fontWeight: 700, textTransform: "uppercase" }}>EN SERVICE</span>}
          </div>
        ))}
        <div style={{ height: 18 }} />
      </>}

      <div className="stitle">🏆 Top plats</div>
      {top10.length === 0 ? <div style={{ color: "var(--t3)", fontSize: 12, padding: "14px 0" }}>Aucune vente aujourd'hui</div> : (
        <div className="toplist">
          {top10.map((item, i) => (
            <div key={item.name} className="topitem">
              <div className={`toprank${i === 0 ? " g" : i === 1 ? " s" : i === 2 ? " b" : ""}`}>#{i + 1}</div>
              <div className="topname">{item.name}</div>
              <div className="topcnt">{item.qty} ×</div>
              <div className="toprev">{item.rev.toFixed(0)} €</div>
            </div>
          ))}
        </div>
      )}

      {session?.role === "admin" && todayLog.length > 0 && <>
        <div style={{ height: 20 }} />
        <div className="stitle">🕐 Pointages du jour</div>
        {todayLog.map(log => {
          const member = staff.find(s => s.id === log.staffId);
          if (!member) return null;
          const dur = (log.clockOut || Date.now()) - log.clockIn;
          const h = Math.floor(dur / 3600000), m = Math.floor((dur % 3600000) / 60000);
          return (
            <div key={log.id} className="clockrow">
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: member.color }} />
              <div style={{ flex: 1, fontWeight: 600 }}>{member.name} <span style={{ fontSize: 9, color: "var(--t3)", textTransform: "uppercase", marginLeft: 4 }}>{member.role}</span></div>
              <span style={{ color: "var(--t2)" }}>▶ {new Date(log.clockIn).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
              {log.clockOut && <span style={{ color: "var(--t2)" }}>■ {new Date(log.clockOut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>}
              <span style={{ color: "var(--acc)", fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}>{h}h{String(m).padStart(2, "0")}</span>
              <span className={`clkpill${log.clockOut ? " out" : " in"}`}>{log.clockOut ? "Terminé" : "En service"}</span>
            </div>
          );
        })}
      </>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════
function AdminPanel() {
  const { staff, setStaff, families, setFamilies, menuItems, setMenuItems, availability, toggleAvail, clockLog } = useApp();
  const [tab, setTab] = useState("staff");
  const [newS, setNewS] = useState({ name: "", pin: "", role: "serveur", color: COLORS[0] });
  const [newF, setNewF] = useState({ name: "", icon: "🍽", sendToKitchen: true, color: "#e67e22" });
  const [newI, setNewI] = useState({ name: "", price: "", desc: "", familyId: families[0]?.id || "", stock: "", photo: null });
  const [editI, setEditI] = useState(null);

  // Gestion stock inline
  const adjustStock = (itemId, delta) => {
    setMenuItems(menuItems.map(m =>
      m.id === itemId && m.stock !== null
        ? { ...m, stock: Math.max(0, m.stock + delta) }
        : m
    ));
  };
  const setStockValue = (itemId, val) => {
    const n = parseInt(val);
    if (isNaN(n)) return;
    setMenuItems(menuItems.map(m => m.id === itemId ? { ...m, stock: Math.max(0, n) } : m));
  };
  const setStockUnlimited = (itemId) => {
    setMenuItems(menuItems.map(m => m.id === itemId ? { ...m, stock: null } : m));
  };
  const initStock = (itemId) => {
    setMenuItems(menuItems.map(m => m.id === itemId && m.stock === null ? { ...m, stock: 0 } : m));
  };

  const addStaff = () => {
    if (!newS.name.trim() || newS.pin.length !== 4) return;
    setStaff([...staff, { ...newS, id: `s_${Date.now()}`, active: true }]);
    setNewS({ name: "", pin: "", role: "serveur", color: COLORS[Math.floor(Math.random() * COLORS.length)] });
  };
  const addFam = () => {
    if (!newF.name.trim()) return;
    setFamilies([...families, { ...newF, id: `fam_${Date.now()}` }]);
    setNewF({ name: "", icon: "🍽", sendToKitchen: true, color: "#e67e22" });
  };
  const addItem = () => {
    if (!newI.name.trim() || !newI.price) return;
    setMenuItems([...menuItems, { ...newI, id: `i_${Date.now()}`, price: parseFloat(newI.price), stock: newI.stock === "" ? null : parseInt(newI.stock) }]);
    setNewI({ name: "", price: "", desc: "", familyId: families[0]?.id || "", stock: "", photo: null });
  };
  const saveEdit = () => {
    if (!editI) return;
    setMenuItems(menuItems.map(m => m.id === editI.id ? { ...editI, price: parseFloat(editI.price), stock: editI.stock === "" || editI.stock === null ? null : parseInt(editI.stock) } : m));
    setEditI(null);
  };

  return (
    <div className="apg">
      <div className="atabs">
        {[["staff","👥 Personnel"],["families","📂 Familles"],["menu","🍽 Menu & Stock"],["avail","🔒 Disponibilités"],["clock","🕐 Pointages"]].map(([t, l]) => (
          <button key={t} className={`atab${tab === t ? " on" : ""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === "staff" && <>
        <div className="asec">
          <div className="asectitle">➕ Ajouter un membre</div>
          <div className="frow">
            <input className="fi" placeholder="Nom complet" value={newS.name} onChange={e => setNewS(p => ({ ...p, name: e.target.value }))} />
            <input className="fi" placeholder="PIN 4 chiffres" maxLength={4} value={newS.pin} onChange={e => setNewS(p => ({ ...p, pin: e.target.value.replace(/\D/g, "") }))} style={{ width: 110, flex: "none" }} />
            <select className="fsel" value={newS.role} onChange={e => setNewS(p => ({ ...p, role: e.target.value }))}>
              {["admin","serveur","cuisine"].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select className="fsel" value={newS.color} onChange={e => setNewS(p => ({ ...p, color: e.target.value }))}>
              {COLORS.map(c => <option key={c} value={c} style={{ background: c }}>● {c}</option>)}
            </select>
          </div>
          <button className="btn btn-acc btn-sm" style={{ width: "auto" }} onClick={addStaff}>➕ Ajouter</button>
        </div>
        <div className="asec">
          <div className="asectitle">👥 Équipe ({staff.length} membres)</div>
          <table className="atable">
            <thead><tr><th>Nom</th><th>PIN</th><th>Rôle</th><th>Couleur</th><th>Actif</th><th>Action</th></tr></thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td><code style={{ background: "var(--bg3)", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>{s.pin}</code></td>
                  <td><span style={{ background: "var(--bg3)", padding: "2px 8px", borderRadius: 10, fontSize: 10, textTransform: "uppercase", letterSpacing: ".5px" }}>{s.role}</span></td>
                  <td><div style={{ width: 12, height: 12, borderRadius: "50%", background: s.color, display: "inline-block" }} /></td>
                  <td><button className={`tog${s.active ? " on" : ""}`} onClick={() => setStaff(staff.map(x => x.id === s.id ? { ...x, active: !x.active } : x))} /></td>
                  <td>{s.id !== "admin1" && <button className="ibtn r" onClick={() => setStaff(staff.filter(x => x.id !== s.id))}>Suppr.</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>}

      {tab === "families" && <>
        <div className="asec">
          <div className="asectitle">➕ Nouvelle famille</div>
          <div className="frow">
            <input className="fi" placeholder="Nom famille" value={newF.name} onChange={e => setNewF(p => ({ ...p, name: e.target.value }))} />
            <input className="fi" placeholder="Emoji" value={newF.icon} onChange={e => setNewF(p => ({ ...p, icon: e.target.value }))} style={{ width: 72, flex: "none" }} />
            <input type="color" className="fi" value={newF.color} onChange={e => setNewF(p => ({ ...p, color: e.target.value }))} style={{ width: 48, flex: "none", padding: 4, cursor: "pointer" }} />
            <select className="fsel" value={newF.sendToKitchen ? "1" : "0"} onChange={e => setNewF(p => ({ ...p, sendToKitchen: e.target.value === "1" }))}>
              <option value="1">→ Envoyer en cuisine</option>
              <option value="0">Bar / Salle uniquement</option>
            </select>
          </div>
          <button className="btn btn-acc btn-sm" style={{ width: "auto" }} onClick={addFam}>➕ Créer famille</button>
        </div>
        <div className="asec">
          <div className="asectitle">📂 Familles ({families.length})</div>
          <table className="atable">
            <thead><tr><th>Icône</th><th>Nom</th><th>Couleur</th><th>Cuisine</th><th>Articles</th><th>Action</th></tr></thead>
            <tbody>
              {families.map(f => (
                <tr key={f.id}>
                  <td style={{ fontSize: 18 }}>{f.icon}</td>
                  <td style={{ fontWeight: 600 }}>{f.name}</td>
                  <td><div style={{ width: 12, height: 12, borderRadius: "50%", background: f.color, display: "inline-block" }} /></td>
                  <td>{f.sendToKitchen ? <span style={{ color: "var(--acc)", fontSize: 11 }}>✓ Oui</span> : <span style={{ color: "var(--t3)", fontSize: 11 }}>Non</span>}</td>
                  <td><span style={{ color: "var(--t2)", fontSize: 11 }}>{menuItems.filter(m => m.familyId === f.id).length}</span></td>
                  <td><button className="ibtn r" onClick={() => setFamilies(families.filter(x => x.id !== f.id))}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>}

      {tab === "menu" && <>
        {/* Formulaire nouveau produit */}
        <div className="asec">
          <div className="asectitle">➕ Nouveau produit</div>
          <div className="frow" style={{ alignItems: "center" }}>
            {/* Photo upload */}
            <div
              onClick={() => { const inp = document.createElement("input"); inp.type="file"; inp.accept="image/*"; inp.onchange=e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setNewI(p=>({...p,photo:ev.target.result})); r.readAsDataURL(f); }; inp.click(); }}
              style={{ width:56, height:56, borderRadius:12, border:"1.5px dashed var(--border2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden", background:"var(--glass2)" }}>
              {newI.photo
                ? <img src={newI.photo} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
            </div>
            <input className="fi" placeholder="Nom du produit" value={newI.name} onChange={e => setNewI(p => ({ ...p, name: e.target.value }))} />
            <input className="fi" placeholder="Prix €" type="number" step="0.5" value={newI.price} onChange={e => setNewI(p => ({ ...p, price: e.target.value }))} style={{ width: 82, flex: "none" }} />
            <input className="fi" placeholder="Description courte" value={newI.desc} onChange={e => setNewI(p => ({ ...p, desc: e.target.value }))} />
            <select className="fsel" value={newI.familyId} onChange={e => setNewI(p => ({ ...p, familyId: e.target.value }))}>
              {families.map(f => <option key={f.id} value={f.id}>{f.icon} {f.name}</option>)}
            </select>
            <input className="fi" placeholder="Stock (∞=vide)" type="number" value={newI.stock} onChange={e => setNewI(p => ({ ...p, stock: e.target.value }))} style={{ width: 100, flex: "none" }} />
          </div>
          <button className="btn btn-acc btn-sm" style={{ width: "auto" }} onClick={addItem}>➕ Ajouter au menu</button>
        </div>

        {/* Modifier article */}
        {editI && (
          <div className="asec" style={{ borderColor: "rgba(255,107,53,.4)" }}>
            <div className="asectitle">✏️ Modifier l'article</div>
            <div className="frow" style={{ alignItems: "center" }}>
              {/* Photo upload pour modification */}
              <div
                onClick={() => { const inp = document.createElement("input"); inp.type="file"; inp.accept="image/*"; inp.onchange=e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setEditI(p=>({...p,photo:ev.target.result})); r.readAsDataURL(f); }; inp.click(); }}
                style={{ width:56, height:56, borderRadius:12, border:"1.5px dashed rgba(255,107,53,.4)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden", background:"var(--glass2)" }}>
                {editI.photo
                  ? <img src={editI.photo} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
              </div>
              <input className="fi" value={editI.name} onChange={e => setEditI(p => ({ ...p, name: e.target.value }))} />
              <input className="fi" type="number" step="0.5" value={editI.price} onChange={e => setEditI(p => ({ ...p, price: e.target.value }))} style={{ width: 82, flex: "none" }} />
              <input className="fi" value={editI.desc} onChange={e => setEditI(p => ({ ...p, desc: e.target.value }))} />
              <select className="fsel" value={editI.familyId} onChange={e => setEditI(p => ({ ...p, familyId: e.target.value }))}>
                {families.map(f => <option key={f.id} value={f.id}>{f.icon} {f.name}</option>)}
              </select>
              <input className="fi" type="number" placeholder="Stock (∞)" value={editI.stock ?? ""} onChange={e => setEditI(p => ({ ...p, stock: e.target.value }))} style={{ width: 100, flex: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-acc btn-sm" style={{ width: "auto" }} onClick={saveEdit}>✓ Enregistrer</button>
              <button className="btn btn-sec btn-sm" style={{ width: "auto" }} onClick={() => setEditI(null)}>Annuler</button>
              {editI.photo && <button className="btn btn-sm" style={{ width:"auto", background:"var(--red-d)", border:"1px solid var(--red)", color:"var(--red)" }} onClick={() => setEditI(p => ({ ...p, photo: null }))}>✕ Photo</button>}
            </div>
          </div>
        )}

        {/* Table menu */}
        <div className="asec">
          <div className="asectitle">🍽 Menu complet ({menuItems.length} articles)</div>
          <table className="atable">
            <thead><tr><th>Photo</th><th>Famille</th><th>Nom</th><th>Prix</th><th>Stock</th><th>Dispo</th><th>Actions</th></tr></thead>
            <tbody>
              {menuItems.map(item => {
                const fam     = families.find(f => f.id === item.familyId);
                const unavail = availability[item.id] === true;
                const isLow   = item.stock !== null && item.stock > 0 && item.stock <= 3;
                const isOut   = item.stock !== null && item.stock <= 0;
                const fColor  = fam?.color || "var(--acc)";
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ width:34, height:34, borderRadius:8, overflow:"hidden", background:"var(--glass2)", border:`1px solid ${fColor}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                        {item.photo ? <img src={item.photo} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : fam?.icon || "🍽"}
                      </div>
                    </td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <div style={{ width:10, height:10, borderRadius:3, background:fColor, flexShrink:0 }} />
                        <span style={{ fontSize:10, color:"var(--t3)" }}>{fam?.name?.slice(0,10)}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight:600, fontSize:12 }}>{item.name}</td>
                    <td><span style={{ color:fColor, fontFamily:"var(--font2)", fontWeight:700 }}>{Number(item.price).toFixed(2)} €</span></td>
                    <td>
                      {item.stock === null
                        ? <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <span style={{ color:"var(--t3)", fontSize:11 }}>∞</span>
                            <button className="ibtn" style={{ fontSize:9, padding:"2px 6px" }} onClick={() => initStock(item.id)}>Définir</button>
                          </div>
                        : <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <button className="ibtn" onClick={() => adjustStock(item.id, -1)} style={{ padding:"2px 7px", fontWeight:700, fontSize:13 }}>−</button>
                            <input type="number" value={item.stock} onChange={e => setStockValue(item.id, e.target.value)}
                              style={{ width:46, background:"var(--glass)", border:`1px solid ${isOut?"var(--red)":isLow?"var(--yellow)":"var(--border)"}`, borderRadius:6, padding:"2px 4px", color:isOut?"var(--red)":isLow?"var(--yellow)":"var(--t1)", fontSize:12, textAlign:"center", fontFamily:"var(--font2)", fontWeight:700 }} />
                            <button className="ibtn" onClick={() => adjustStock(item.id, +1)} style={{ padding:"2px 7px", fontWeight:700, fontSize:13 }}>+</button>
                            {isOut && <span style={{ fontSize:9, color:"var(--red)", fontWeight:700 }}>ÉPU</span>}
                            <button className="ibtn" style={{ fontSize:9, padding:"2px 5px" }} onClick={() => setStockUnlimited(item.id)}>∞</button>
                          </div>}
                    </td>
                    <td><button className={`tog${!unavail ? " on" : ""}`} onClick={() => toggleAvail(item.id)} /></td>
                    <td style={{ display:"flex", gap:4 }}>
                      <button className="ibtn g" onClick={() => setEditI({ ...item, price: String(item.price), stock: item.stock !== null ? String(item.stock) : "" })}>✏</button>
                      <button className="ibtn r" onClick={() => setMenuItems(menuItems.filter(m => m.id !== item.id))}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>}

      {tab === "avail" && (
        <div className="asec">
          <div className="asectitle">🔒 Disponibilités rapides</div>
          <p style={{ fontSize: 12, color: "var(--t2)", marginBottom: 16, lineHeight: 1.5 }}>Cliquez sur un article pour le rendre indisponible (rouge) ou disponible (vert). Les articles indisponibles ne peuvent pas être commandés.</p>
          {families.map(fam => {
            const items = menuItems.filter(m => m.familyId === fam.id);
            if (!items.length) return null;
            return (
              <div key={fam.id} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--t2)", marginBottom: 7, display: "flex", alignItems: "center", gap: 6 }}>{fam.icon} {fam.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {items.map(item => {
                    const unavail = availability[item.id] === true;
                    return (
                      <div key={item.id} onClick={() => toggleAvail(item.id)} style={{ padding: "6px 11px", borderRadius: 8, border: `1px solid ${unavail ? "var(--red)" : "var(--green)"}`, background: unavail ? "var(--red-d)" : "var(--green-d)", color: unavail ? "var(--red)" : "var(--green)", fontSize: 11, cursor: "pointer", transition: "all .15s", textDecoration: unavail ? "line-through" : "none", fontWeight: 600 }}>
                        {item.name}
                        {item.stock !== null && <span style={{ marginLeft: 4, fontSize: 9, opacity: .7 }}>({item.stock === 0 ? "épuisé" : item.stock})</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "clock" && (() => {
        const todayLog = clockLog.filter(l => new Date(l.clockIn).toDateString() === new Date().toDateString());
        return (
          <div className="asec">
            <div className="asectitle">🕐 Pointages du jour — {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long" })}</div>
            {todayLog.length === 0
              ? <div style={{ color: "var(--t3)", fontSize: 12 }}>Aucun pointage enregistré aujourd'hui</div>
              : todayLog.map(log => {
                  const member = staff.find(s => s.id === log.staffId);
                  if (!member) return null;
                  const dur = (log.clockOut || Date.now()) - log.clockIn;
                  const h = Math.floor(dur / 3600000);
                  const m = Math.floor((dur % 3600000) / 60000);
                  const fmt = ts => new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <div key={log.id} className="clockrow" style={{ marginBottom: 8 }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: member.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{member.name}</div>
                        <div style={{ fontSize: 9, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".5px" }}>{member.role}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                        <span style={{ fontSize: 11, color: "var(--t2)" }}>▶ Arrivée <b style={{ color: "var(--green)" }}>{fmt(log.clockIn)}</b></span>
                        {log.clockOut
                          ? <span style={{ fontSize: 11, color: "var(--t2)" }}>■ Départ <b style={{ color: "var(--red)" }}>{fmt(log.clockOut)}</b></span>
                          : <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 700 }}>● EN SERVICE</span>}
                      </div>
                      <span style={{ color: "var(--acc)", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: 18, minWidth: 52, textAlign: "right" }}>{h}h{String(m).padStart(2, "0")}</span>
                      <span className={`clkpill${log.clockOut ? " out" : " in"}`}>{log.clockOut ? "Terminé" : "En service"}</span>
                    </div>
                  );
                })
            }
          </div>
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════
function AppInner() {
  const { session, logout, page } = useApp();
  const [activeTable, setActiveTable]     = useState(null);
  const [showLogout,  setShowLogout]      = useState(false);

  if (!session) return <Login />;

  const handleLogoutConfirm = () => {
    setShowLogout(false);
    logout(true);
  };

  const effectivePage = page === "tables" && session.role === "cuisine" ? "kitchen" : page;

  return (
    <div className="app">
      <style>{CSS}</style>
      <Header
        activeTable={activeTable}
        onBack={() => setActiveTable(null)}
        onLogoutRequest={() => setShowLogout(true)}
      />
      <ClockBanner />
      <ToastStack />

      {/* ── MODAL FIN DE SERVICE ── */}
      {showLogout && (
        <LogoutConfirmModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogout(false)}
        />
      )}

      {/* ── SERVEUR ── */}
      {session.role === "serveur" && effectivePage === "tables" && !activeTable && <TablePlan onSelectTable={setActiveTable} />}
      {session.role === "serveur" && effectivePage === "tables" && activeTable && <OrderScreen tableId={activeTable} />}
      {session.role === "serveur" && effectivePage === "kitchen_view" && <KitchenReadOnly />}
      {session.role === "serveur" && effectivePage === "stats" && <Stats />}

      {/* ── CUISINE ── */}
      {session.role === "cuisine" && (effectivePage === "kitchen" || effectivePage === "tables") && <Kitchen />}
      {session.role === "cuisine" && effectivePage === "stats" && <Stats />}

      {/* ── ADMIN ── */}
      {session.role === "admin" && effectivePage === "tables" && !activeTable && <TablePlan onSelectTable={setActiveTable} />}
      {session.role === "admin" && effectivePage === "tables" && activeTable && <OrderScreen tableId={activeTable} />}
      {session.role === "admin" && effectivePage === "kitchen" && <Kitchen />}
      {session.role === "admin" && effectivePage === "stats" && <Stats />}
      {session.role === "admin" && effectivePage === "admin" && <AdminPanel />}

      {/* ── NAV BARRE MOBILE (cachée sur desktop via CSS) ── */}
      {!activeTable && <MobileNav onLogoutRequest={() => setShowLogout(true)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <style>{CSS}</style>
      <AppInner />
    </AppProvider>
  );
}
