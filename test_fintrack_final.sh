#!/bin/bash

# ============================================================
#  FinTrack — Julia's 2-Month Student Life Test Seed
#  WITH CATEGORIES properly assigned!
# ============================================================

BASE_URL="http://localhost:5000"
EMAIL="khelifihachemm@gmail.com"
PASSWORD="123456789"
TOKEN=""

# ── Category IDs ──────────────────────────────────────────
CAT_BILLS="129a41cc-81fd-43ff-8d7b-5a18a9791a7c"
CAT_FAMILLE="141872cb-5a0c-4220-8028-0882bf9a9004"
CAT_FOOD="c87b4b71-33f4-480f-b694-e1a5f2481087"
CAT_TRANSPORT="f4bc32c8-e922-41d5-bed9-2d8083e872aa"
CAT_ENTERTAINMENT="2f07b628-a64d-402e-9d7e-f3e6084904a8"
CAT_EDUCATION="ec7c77d9-1ca8-4115-b646-6909d5b1a11a"
CAT_HEALTH="29dfd4c0-2c88-4073-bb39-e7229e676e09"
CAT_SHOPPING="587ecc27-dee0-40e8-8261-ddc9e14f92bc"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   FinTrack — Julia's Student Life Test 🎓   ║${NC}"
echo -e "${CYAN}║         NOW WITH CATEGORIES! 🏷️             ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"
echo ""

# ── Helper: POST ─────────────────────────────────────────
post() {
  local endpoint=$1
  local data=$2
  local use_auth=${3:-true}
  if [ "$use_auth" = true ]; then
    curl -s -X POST "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$data"
  else
    curl -s -X POST "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data"
  fi
}

# ── Helper: add transaction with category ────────────────
add_transaction() {
  local type=$1
  local amount=$2
  local note=$3
  local date=$4
  local category_id=$5

  local data="{\"type\":\"$type\",\"amount\":$amount,\"note\":\"$note\",\"date\":\"$date\",\"category_id\":\"$category_id\"}"
  local result=$(post "/api/transactions" "$data")
  local balance=$(echo $result | grep -o '"balance":[0-9.]*' | head -1 | cut -d: -f2)

  if echo $result | grep -q '"transaction"'; then
    if [ "$type" = "income" ]; then
      echo -e "  ${GREEN}✅ INCOME  +${amount} DT${NC} | $note ($date) | Balance: ${balance} DT"
    else
      echo -e "  ${RED}💸 EXPENSE -${amount} DT${NC} | $note ($date) | Balance: ${balance} DT"
    fi
  else
    echo -e "  ${RED}❌ FAILED${NC} | $note | Response: $result"
  fi
  sleep 0.3
}

# ══════════════════════════════════════════════════════════
# STEP 1 — Login
# ══════════════════════════════════════════════════════════
echo -e "${YELLOW}► Logging in...${NC}"
LOGIN=$(post "/api/auth/login" \
  "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  false)
TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed!${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Logged in!${NC}"
echo ""

# ══════════════════════════════════════════════════════════
# MONTH 1 — APRIL 2026
# ══════════════════════════════════════════════════════════
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         📅 MONTH 1 — APRIL 2026         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}📅 Week 1 — Apr 1 to 7${NC}"
add_transaction "income"  150   "Virement papa — semaine 1"      "2026-04-01" "$CAT_FAMILLE"
add_transaction "expense" 35    "Loyer (part du mois)"           "2026-04-01" "$CAT_BILLS"
add_transaction "expense" 8.5   "Courses supermarché"            "2026-04-02" "$CAT_FOOD"
add_transaction "expense" 2     "Bus universitaire"              "2026-04-02" "$CAT_TRANSPORT"
add_transaction "expense" 3.5   "Café + croissant avec Amir"     "2026-04-03" "$CAT_FOOD"
add_transaction "expense" 6     "Lunch at university cafeteria"  "2026-04-03" "$CAT_FOOD"
add_transaction "expense" 1.8   "Bus retour"                     "2026-04-04" "$CAT_TRANSPORT"
add_transaction "expense" 15    "Pharmacie — médicaments"        "2026-04-04" "$CAT_HEALTH"
add_transaction "expense" 4.5   "Petit déjeuner boulangerie"     "2026-04-05" "$CAT_FOOD"
add_transaction "expense" 22    "Courses épicerie semaine"       "2026-04-05" "$CAT_FOOD"
add_transaction "expense" 3.5   "Coffee shop — révisions"        "2026-04-06" "$CAT_FOOD"
add_transaction "expense" 8     "Dîner pizza avec colocs"        "2026-04-06" "$CAT_FOOD"
add_transaction "expense" 2.5   "Transport retour soirée"        "2026-04-07" "$CAT_TRANSPORT"
echo ""

echo -e "${YELLOW}📅 Week 2 — Apr 8 to 14${NC}"
add_transaction "income"  150   "Virement papa — semaine 2"      "2026-04-08" "$CAT_FAMILLE"
add_transaction "expense" 35    "Loyer (part du mois)"           "2026-04-08" "$CAT_BILLS"
add_transaction "expense" 3.5   "Bus matin"                      "2026-04-08" "$CAT_TRANSPORT"
add_transaction "expense" 7     "Déjeuner resto universitaire"   "2026-04-08" "$CAT_FOOD"
add_transaction "expense" 1.8   "Transport retour"               "2026-04-09" "$CAT_TRANSPORT"
add_transaction "expense" 45    "Facture électricité + internet" "2026-04-09" "$CAT_BILLS"
add_transaction "expense" 12    "Grocery shopping"               "2026-04-10" "$CAT_FOOD"
add_transaction "expense" 3.5   "Café étude bibliothèque"        "2026-04-11" "$CAT_FOOD"
add_transaction "expense" 5     "Snacks pour révisions"          "2026-04-11" "$CAT_FOOD"
add_transaction "expense" 18    "Sortie cinéma avec amis"        "2026-04-12" "$CAT_ENTERTAINMENT"
add_transaction "expense" 9.5   "Uber retour cinéma"             "2026-04-12" "$CAT_TRANSPORT"
add_transaction "expense" 6     "Lunch sandwich + jus"           "2026-04-13" "$CAT_FOOD"
add_transaction "expense" 3.5   "Café le matin"                  "2026-04-13" "$CAT_FOOD"
add_transaction "expense" 2.5   "Bus aller"                      "2026-04-14" "$CAT_TRANSPORT"
add_transaction "expense" 8     "Supermarché — produits ménage"  "2026-04-14" "$CAT_FOOD"
echo ""

echo -e "${YELLOW}📅 Week 3 — Apr 15 to 21${NC}"
add_transaction "income"  150   "Virement papa — semaine 3"      "2026-04-15" "$CAT_FAMILLE"
add_transaction "expense" 35    "Loyer (part du mois)"           "2026-04-15" "$CAT_BILLS"
add_transaction "expense" 3.5   "Bus universitaire"              "2026-04-15" "$CAT_TRANSPORT"
add_transaction "expense" 6.5   "Déjeuner cafétéria"             "2026-04-15" "$CAT_FOOD"
add_transaction "expense" 1.8   "Transport retour maison"        "2026-04-16" "$CAT_TRANSPORT"
add_transaction "expense" 25    "Vêtements — soldes"             "2026-04-16" "$CAT_SHOPPING"
add_transaction "expense" 35    "Courses alimentaires semaine"   "2026-04-17" "$CAT_FOOD"
add_transaction "expense" 6     "Dinner out with friends"        "2026-04-18" "$CAT_ENTERTAINMENT"
add_transaction "expense" 3.5   "Café révisions examen"          "2026-04-18" "$CAT_FOOD"
add_transaction "expense" 15    "Livres universitaires"          "2026-04-19" "$CAT_EDUCATION"
add_transaction "expense" 8.5   "Épicerie express"               "2026-04-19" "$CAT_FOOD"
add_transaction "expense" 4     "Bus hebdo"                      "2026-04-20" "$CAT_TRANSPORT"
add_transaction "expense" 12    "Repas extérieur"                "2026-04-20" "$CAT_FOOD"
add_transaction "expense" 4.5   "Snacks + boissons"              "2026-04-20" "$CAT_FOOD"
add_transaction "expense" 2.5   "Transport"                      "2026-04-21" "$CAT_TRANSPORT"
add_transaction "expense" 3.5   "Petit déjeuner"                 "2026-04-21" "$CAT_FOOD"
echo ""

echo -e "${YELLOW}📅 Week 4 — Apr 22 to 30${NC}"
add_transaction "income"  150   "Virement papa — semaine 4"      "2026-04-22" "$CAT_FAMILLE"
add_transaction "expense" 35    "Loyer (dernière part)"          "2026-04-22" "$CAT_BILLS"
add_transaction "expense" 3.5   "Café matin"                     "2026-04-22" "$CAT_FOOD"
add_transaction "expense" 6     "Lunch university"               "2026-04-22" "$CAT_FOOD"
add_transaction "expense" 1.8   "Bus retour"                     "2026-04-23" "$CAT_TRANSPORT"
add_transaction "expense" 5     "Pharmacie vitamines"            "2026-04-23" "$CAT_HEALTH"
add_transaction "expense" 8     "Weekly grocery run"             "2026-04-24" "$CAT_FOOD"
add_transaction "expense" 4.5   "Déjeuner avec amis"             "2026-04-24" "$CAT_FOOD"
add_transaction "expense" 1.8   "Transport matin"                "2026-04-25" "$CAT_TRANSPORT"
add_transaction "expense" 3     "Café + eau"                     "2026-04-25" "$CAT_FOOD"
add_transaction "expense" 2.5   "Bus"                            "2026-04-26" "$CAT_TRANSPORT"
add_transaction "expense" 8     "Courses supermarché"            "2026-04-26" "$CAT_FOOD"
add_transaction "expense" 3.5   "Breakfast café"                 "2026-04-27" "$CAT_FOOD"
add_transaction "expense" 4     "Déjeuner sandwich"              "2026-04-27" "$CAT_FOOD"
add_transaction "expense" 1.8   "Transport"                      "2026-04-28" "$CAT_TRANSPORT"
add_transaction "expense" 5.5   "Épicerie express"               "2026-04-28" "$CAT_FOOD"
add_transaction "expense" 3.5   "Café révisions"                 "2026-04-29" "$CAT_FOOD"
add_transaction "expense" 2     "Bus universitaire"              "2026-04-29" "$CAT_TRANSPORT"
add_transaction "expense" 4     "Dîner maison — courses"         "2026-04-30" "$CAT_FOOD"
add_transaction "expense" 1.8   "Transport retour maison"        "2026-04-30" "$CAT_TRANSPORT"
echo ""
echo -e "${GREEN}✅ Month 1 (April) complete!${NC}"
echo ""

# ══════════════════════════════════════════════════════════
# MONTH 2 — MAY 2026
# ══════════════════════════════════════════════════════════
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          📅 MONTH 2 — MAY 2026          ║${NC}"
echo -e "${BLUE}║    🐷 Piggy bank auto-save triggered!    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}📅 Week 1 — May 1 to 7 🐷${NC}"
add_transaction "income"  150   "Virement papa — Mai semaine 1"  "2026-05-01" "$CAT_FAMILLE"
add_transaction "expense" 35    "Loyer mai — part 1"             "2026-05-01" "$CAT_BILLS"
add_transaction "expense" 8     "Grocery — début du mois"        "2026-05-01" "$CAT_FOOD"
add_transaction "expense" 2     "Bus université"                 "2026-05-02" "$CAT_TRANSPORT"
add_transaction "expense" 3.5   "Café révisions examens"         "2026-05-02" "$CAT_FOOD"
add_transaction "expense" 12    "Cours particulier maths"        "2026-05-03" "$CAT_EDUCATION"
add_transaction "expense" 1.8   "Transport"                      "2026-05-03" "$CAT_TRANSPORT"
add_transaction "expense" 6     "Déjeuner cafétéria"             "2026-05-04" "$CAT_FOOD"
add_transaction "expense" 4.5   "Snacks bibliothèque"            "2026-05-04" "$CAT_FOOD"
add_transaction "expense" 3     "Coffee — late night study"      "2026-05-05" "$CAT_FOOD"
add_transaction "expense" 15    "Courses alimentaires semaine"   "2026-05-05" "$CAT_FOOD"
add_transaction "expense" 2.5   "Bus"                            "2026-05-06" "$CAT_TRANSPORT"
add_transaction "expense" 8.5   "Sortie détente après examen"    "2026-05-06" "$CAT_ENTERTAINMENT"
add_transaction "expense" 1.8   "Transport retour"               "2026-05-07" "$CAT_TRANSPORT"
add_transaction "expense" 4     "Petit déjeuner boulangerie"     "2026-05-07" "$CAT_FOOD"
echo ""

echo -e "${YELLOW}📅 Week 2 — May 8 to 14${NC}"
add_transaction "income"  150   "Virement papa — Mai semaine 2"  "2026-05-08" "$CAT_FAMILLE"
add_transaction "expense" 35    "Loyer mai — part 2"             "2026-05-08" "$CAT_BILLS"
add_transaction "expense" 3.5   "Bus matin examen"               "2026-05-08" "$CAT_TRANSPORT"
add_transaction "expense" 6     "Lunch post-exam celebration"    "2026-05-08" "$CAT_FOOD"
add_transaction "expense" 45    "Facture électricité mai"        "2026-05-09" "$CAT_BILLS"
add_transaction "expense" 1.8   "Transport"                      "2026-05-09" "$CAT_TRANSPORT"
add_transaction "expense" 12    "Weekly grocery shopping"        "2026-05-10" "$CAT_FOOD"
add_transaction "expense" 3.5   "Café étude"                     "2026-05-11" "$CAT_FOOD"
add_transaction "expense" 8     "Dîner avec amis après examens"  "2026-05-11" "$CAT_ENTERTAINMENT"
add_transaction "expense" 2.5   "Bus universitaire"              "2026-05-12" "$CAT_TRANSPORT"
add_transaction "expense" 9.5   "Matériel scolaire"              "2026-05-12" "$CAT_EDUCATION"
add_transaction "expense" 3.5   "Breakfast café"                 "2026-05-13" "$CAT_FOOD"
add_transaction "expense" 6.5   "Déjeuner resto"                 "2026-05-13" "$CAT_FOOD"
add_transaction "expense" 1.8   "Transport retour"               "2026-05-14" "$CAT_TRANSPORT"
add_transaction "expense" 5     "Supermarché express"            "2026-05-14" "$CAT_FOOD"
echo ""

echo -e "${YELLOW}📅 Week 3 — May 15 to 21${NC}"
add_transaction "income"  150   "Virement papa — Mai semaine 3"  "2026-05-15" "$CAT_FAMILLE"
add_transaction "expense" 35    "Loyer mai — part 3"             "2026-05-15" "$CAT_BILLS"
add_transaction "expense" 8     "Courses alimentaires"           "2026-05-15" "$CAT_FOOD"
add_transaction "expense" 2     "Bus"                            "2026-05-16" "$CAT_TRANSPORT"
add_transaction "expense" 3.5   "Café matin"                     "2026-05-16" "$CAT_FOOD"
add_transaction "expense" 18    "Shopping vêtements été"         "2026-05-17" "$CAT_SHOPPING"
add_transaction "expense" 6     "Déjeuner sandwich"              "2026-05-17" "$CAT_FOOD"
add_transaction "expense" 1.8   "Transport"                      "2026-05-18" "$CAT_TRANSPORT"
add_transaction "expense" 4.5   "Snacks + boissons"              "2026-05-18" "$CAT_FOOD"
add_transaction "expense" 25    "Sortie weekend — restaurant"    "2026-05-19" "$CAT_ENTERTAINMENT"
add_transaction "expense" 9.5   "Uber retour soirée"             "2026-05-19" "$CAT_TRANSPORT"
add_transaction "expense" 3.5   "Café dimanche matin"            "2026-05-20" "$CAT_FOOD"
add_transaction "expense" 12    "Grocery run"                    "2026-05-20" "$CAT_FOOD"
add_transaction "expense" 2.5   "Bus lundi"                      "2026-05-21" "$CAT_TRANSPORT"
add_transaction "expense" 6.5   "Déjeuner universitaire"         "2026-05-21" "$CAT_FOOD"
echo ""

echo -e "${YELLOW}📅 Week 4 — May 22 to 31${NC}"
add_transaction "income"  150   "Virement papa — Mai semaine 4"  "2026-05-22" "$CAT_FAMILLE"
add_transaction "expense" 35    "Loyer mai — part 4"             "2026-05-22" "$CAT_BILLS"
add_transaction "expense" 3.5   "Café révisions"                 "2026-05-22" "$CAT_FOOD"
add_transaction "expense" 6     "Lunch café"                     "2026-05-23" "$CAT_FOOD"
add_transaction "expense" 1.8   "Bus"                            "2026-05-23" "$CAT_TRANSPORT"
add_transaction "expense" 8     "Supermarché"                    "2026-05-24" "$CAT_FOOD"
add_transaction "expense" 4.5   "Déjeuner avec amis"             "2026-05-24" "$CAT_FOOD"
add_transaction "expense" 3     "Coffee shop study session"      "2026-05-25" "$CAT_FOOD"
add_transaction "expense" 1.8   "Transport"                      "2026-05-25" "$CAT_TRANSPORT"
add_transaction "expense" 12    "Courses alimentaires fin mois"  "2026-05-26" "$CAT_FOOD"
add_transaction "expense" 2.5   "Bus"                            "2026-05-26" "$CAT_TRANSPORT"
add_transaction "expense" 3.5   "Petit déjeuner"                 "2026-05-27" "$CAT_FOOD"
add_transaction "expense" 8     "Dîner soirée fin examen"        "2026-05-27" "$CAT_ENTERTAINMENT"
add_transaction "expense" 4     "Transport soirée"               "2026-05-28" "$CAT_TRANSPORT"
add_transaction "expense" 1.8   "Bus matin"                      "2026-05-29" "$CAT_TRANSPORT"
add_transaction "expense" 5.5   "Épicerie express"               "2026-05-29" "$CAT_FOOD"
add_transaction "expense" 3.5   "Café + croissant"               "2026-05-30" "$CAT_FOOD"
add_transaction "expense" 2     "Bus universitaire"              "2026-05-30" "$CAT_TRANSPORT"
add_transaction "expense" 6     "Last lunch of the month"        "2026-05-31" "$CAT_FOOD"
add_transaction "expense" 1.8   "Transport retour maison"        "2026-05-31" "$CAT_TRANSPORT"
echo ""

echo -e "${CYAN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              📊 SEED COMPLETE!              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Categories breakdown:"
echo -e "  🏠 Bills        — Loyer + électricité"
echo -e "  👨‍👩‍👧 Famille      — Weekly allowance (income)"
echo -e "  🍕 Food         — All meals, café, groceries"
echo -e "  🚌 Transport    — Bus, Uber"
echo -e "  🎬 Entertainment — Cinema, restaurants, outings"
echo -e "  📚 Education    — Books, cours particulier"
echo -e "  💊 Health       — Pharmacie"
echo -e "  🛍️  Shopping     — Clothes"
echo ""
echo -e "${GREEN}Go check your Analytics page now! 🚀${NC}"
echo ""
