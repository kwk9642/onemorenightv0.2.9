#!/usr/bin/env python3
"""Generate the 50-state town atlas and wire neighbors within ~108 miles."""
import math, re
from pathlib import Path

ROOT = Path("/workspace")
data = (ROOT / "src/game/data.ts").read_text()
loc_src = data.split("export const LOCATIONS")[1].split("export const FIRST_NAMES")[0]
exist = []
for m in re.finditer(
    r'\{\s*id: "([^"]+)"[\s\S]*?region: "([^"]+)"[\s\S]*?lat: ([0-9.-]+),\n\s*lng: ([0-9.-]+)',
    loc_src,
):
    exist.append({"id": m.group(1), "st": m.group(2), "lat": float(m.group(3)), "lng": float(m.group(4)), "new": False})

# id, zh, en, st, lat, lng, img
NEW = [
("montgomery_al","蒙哥馬利","Montgomery","al",32.38,-86.30,"south"),
("mobile_al","莫比爾","Mobile","al",30.70,-88.04,"south"),
("anchorage_ak","安克雷奇","Anchorage","ak",61.22,-149.90,"pacific"),
("fairbanks_ak","費爾班克斯","Fairbanks","ak",64.84,-147.72,"pacific"),
("juneau_ak","朱諾","Juneau","ak",58.30,-134.42,"pacific"),
("phoenix_az","鳳凰城","Phoenix","az",33.45,-112.07,"desert"),
("tucson_az","圖森","Tucson","az",32.22,-110.97,"desert"),
("flagstaff_az","弗拉格斯塔夫","Flagstaff","az",35.20,-111.65,"desert"),
("kingman_az","金曼","Kingman","az",35.19,-114.05,"desert"),
("little_rock_keep","", "", "ar", 0, 0, ""),
("denver_co","丹佛","Denver","co",39.74,-104.99,"plains"),
("colorado_springs_co","科羅拉多斯普林斯","Colorado Springs","co",38.83,-104.82,"plains"),
("frisco_co","弗里斯科","Frisco","co",39.57,-106.10,"plains"),
("glenwood_co","格倫伍德溫泉","Glenwood Springs","co",39.55,-107.32,"plains"),
("grand_junction_co","大章克申","Grand Junction","co",39.06,-108.55,"desert"),
("hartford_ct","哈特福","Hartford","ct",41.76,-72.68,"ne"),
("new_haven_ct","紐黑文","New Haven","ct",41.31,-72.93,"ne"),
("wilmington_de","威明頓","Wilmington","de",39.74,-75.55,"ne"),
("dover_de","多佛","Dover","de",39.16,-75.52,"ne"),
("jacksonville_fl","傑克遜維爾","Jacksonville","fl",30.33,-81.66,"south"),
("tallahassee_fl","塔拉哈西","Tallahassee","fl",30.44,-84.28,"south"),
("orlando_fl","奧蘭多","Orlando","fl",28.54,-81.38,"south"),
("miami_fl","邁阿密","Miami","fl",25.76,-80.19,"south"),
("atlanta_ga","亞特蘭大","Atlanta","ga",33.75,-84.39,"south"),
("savannah_ga","薩凡納","Savannah","ga",32.08,-81.09,"south"),
("macon_ga","梅肯","Macon","ga",32.84,-83.63,"south"),
("honolulu_hi","檀香山","Honolulu","hi",21.31,-157.86,"pacific"),
("hilo_hi","希洛","Hilo","hi",19.73,-155.09,"pacific"),
("boise_id","博伊西","Boise","id",43.62,-116.21,"desert"),
("twin_falls_id","雙子瀑","Twin Falls","id",42.56,-114.46,"desert"),
("pocatello_id","波卡特洛","Pocatello","id",42.87,-112.45,"desert"),
("springfield_il_keep","","","il",0,0,""),
("fort_wayne_in","韋恩堡","Fort Wayne","in",41.08,-85.14,"south"),
("south_bend_in","南本德","South Bend","in",41.68,-86.25,"south"),
("cedar_rapids_ia","錫達拉皮茲","Cedar Rapids","ia",41.98,-91.67,"plains"),
("wichita_ks","威奇托","Wichita","ks",37.69,-97.33,"plains"),
("topeka_ks","托皮卡","Topeka","ks",39.05,-95.68,"plains"),
("kansas_city_ks","堪薩斯市","Kansas City","ks",39.11,-94.63,"plains"),
("salina_ks","薩萊納","Salina","ks",38.84,-97.61,"plains"),
("baton_rouge_la","巴吞魯日","Baton Rouge","la",30.45,-91.19,"south"),
("new_orleans_la","紐奧良","New Orleans","la",29.95,-90.07,"south"),
("shreveport_la","什里夫波特","Shreveport","la",32.53,-93.75,"south"),
("portland_me","波特蘭","Portland","me",43.66,-70.26,"ne"),
("bangor_me","班戈","Bangor","me",44.80,-68.77,"ne"),
("baltimore_md","巴爾的摩","Baltimore","md",39.29,-76.61,"ne"),
("hagerstown_md","黑格斯敦","Hagerstown","md",39.64,-77.72,"ne"),
("boston_ma","波士頓","Boston","ma",42.36,-71.06,"ne"),
("springfield_ma","春田","Springfield","ma",42.10,-72.59,"ne"),
("worcester_ma","伍斯特","Worcester","ma",42.26,-71.80,"ne"),
("grand_rapids_mi","大急流城","Grand Rapids","mi",42.96,-85.66,"south"),
("lansing_mi","蘭辛","Lansing","mi",42.73,-84.56,"south"),
("minneapolis_mn","明尼阿波利斯","Minneapolis","mn",44.98,-93.27,"plains"),
("duluth_mn","杜魯斯","Duluth","mn",46.79,-92.10,"plains"),
("st_cloud_mn","聖克勞德","St. Cloud","mn",45.56,-94.16,"plains"),
("gulfport_ms","格爾夫波特","Gulfport","ms",30.37,-89.09,"south"),
("meridian_ms","默里迪恩","Meridian","ms",32.36,-88.70,"south"),
("kansas_city_mo","堪薩斯城","Kansas City","mo",39.10,-94.58,"plains"),
("springfield_mo","春田","Springfield","mo",37.21,-93.29,"plains"),
("columbia_mo","哥倫比亞","Columbia","mo",38.95,-92.33,"plains"),
("billings_mt","比林斯","Billings","mt",45.78,-108.50,"plains"),
("great_falls_mt","大瀑布","Great Falls","mt",47.50,-111.30,"plains"),
("missoula_mt","米蘇拉","Missoula","mt",46.87,-114.00,"pacific"),
("bozeman_mt","博茲曼","Bozeman","mt",45.68,-111.04,"plains"),
("omaha_ne","奧馬哈","Omaha","ne",41.26,-95.94,"plains"),
("lincoln_ne","林肯","Lincoln","ne",40.81,-96.70,"plains"),
("north_platte_ne","北普拉特","North Platte","ne",41.14,-100.76,"plains"),
("las_vegas_nv","拉斯維加斯","Las Vegas","nv",36.17,-115.14,"desert"),
("reno_nv","里諾","Reno","nv",39.53,-119.81,"desert"),
("elko_nv","埃爾科","Elko","nv",40.83,-115.76,"desert"),
("manchester_nh","曼徹斯特","Manchester","nh",42.99,-71.46,"ne"),
("concord_nh","康科德","Concord","nh",43.21,-71.54,"ne"),
("newark_nj","紐瓦克","Newark","nj",40.74,-74.17,"ne"),
("trenton_nj","特倫頓","Trenton","nj",40.22,-74.76,"ne"),
("albuquerque_nm","阿布奎基","Albuquerque","nm",35.08,-106.65,"desert"),
("santa_fe_nm","聖塔菲","Santa Fe","nm",35.69,-105.94,"desert"),
("las_cruces_nm","拉斯克魯塞斯","Las Cruces","nm",32.32,-106.76,"desert"),
("farmington_nm","法明頓","Farmington","nm",36.73,-108.22,"desert"),
("buffalo_ny","水牛城","Buffalo","ny",42.89,-78.88,"ne"),
("albany_ny","奧爾巴尼","Albany","ny",42.65,-73.76,"ne"),
("new_york_ny","紐約","New York","ny",40.71,-74.01,"ne"),
("syracuse_ny","錫拉丘茲","Syracuse","ny",43.05,-76.15,"ne"),
("rochester_ny","羅徹斯特","Rochester","ny",43.16,-77.61,"ne"),
("charlotte_nc","夏洛特","Charlotte","nc",35.23,-80.84,"south"),
("raleigh_nc","羅利","Raleigh","nc",35.78,-78.64,"south"),
("asheville_nc","阿什維爾","Asheville","nc",35.60,-82.55,"south"),
("fargo_nd","法戈","Fargo","nd",46.88,-96.79,"plains"),
("bismarck_nd","俾斯麥","Bismarck","nd",46.81,-100.78,"plains"),
("minot_nd","邁諾特","Minot","nd",48.23,-101.30,"plains"),
("cincinnati_keep","","","oh",0,0,""),
("oklahoma_city_ok","奧克拉荷馬市","Oklahoma City","ok",35.47,-97.52,"plains"),
("tulsa_ok","塔爾薩","Tulsa","ok",36.15,-95.99,"plains"),
("lawton_ok","勞頓","Lawton","ok",34.61,-98.40,"plains"),
("portland_or","波特蘭","Portland","or",45.52,-122.68,"pacific"),
("eugene_or","尤金","Eugene","or",44.05,-123.09,"pacific"),
("pendleton_or","彭德爾頓","Pendleton","or",45.67,-118.79,"pacific"),
("the_dalles_or","達爾斯","The Dalles","or",45.59,-121.18,"pacific"),
("baker_city_or","貝克城","Baker City","or",44.77,-117.83,"pacific"),
("erie_pa","伊利","Erie","pa",42.13,-80.09,"ne"),
("harrisburg_pa","哈里斯堡","Harrisburg","pa",40.27,-76.88,"ne"),
("philadelphia_pa","費城","Philadelphia","pa",39.95,-75.17,"ne"),
("providence_ri","普羅維登斯","Providence","ri",41.82,-71.41,"ne"),
("warwick_ri","沃威克","Warwick","ri",41.70,-71.42,"ne"),
("los_angeles_ca","洛杉磯","Los Angeles","ca",34.05,-118.24,"pacific"),
("san_diego_ca","聖地牙哥","San Diego","ca",32.72,-117.16,"pacific"),
("san_francisco_ca","舊金山","San Francisco","ca",37.77,-122.42,"pacific"),
("sacramento_ca","沙加緬度","Sacramento","ca",38.58,-121.49,"pacific"),
("fresno_ca","弗雷斯諾","Fresno","ca",36.74,-119.79,"pacific"),
("bakersfield_ca","貝克斯菲爾德","Bakersfield","ca",35.37,-119.02,"pacific"),
("modesto_ca","莫德斯托","Modesto","ca",37.64,-121.00,"pacific"),
("redding_ca","雷丁","Redding","ca",40.59,-122.39,"pacific"),
("barstow_ca","巴斯托","Barstow","ca",34.90,-117.02,"desert"),
("terre_haute_in","特雷霍特","Terre Haute","in",39.47,-87.41,"south"),
("evansville_in","埃文斯維爾","Evansville","in",37.97,-87.57,"south"),
("effingham_il","埃芬漢","Effingham","il",39.12,-88.54,"south"),
("paducah_ky","帕迪尤卡","Paducah","ky",37.08,-88.60,"south"),
("cape_girardeau_mo","開普吉拉多","Cape Girardeau","mo",37.31,-89.52,"south"),
("socorro_nm","索科羅","Socorro","nm",34.06,-106.89,"desert"),
("williams_az","威廉斯","Williams","az",35.25,-112.19,"desert"),
("quincy_il","昆西","Quincy","il",39.94,-91.41,"plains"),
("burlington_ia","伯靈頓","Burlington","ia",40.81,-91.11,"plains"),
("kearney_ne","卡尼","Kearney","ne",40.70,-99.08,"plains"),
("sidney_ne","錫尼","Sidney","ne",41.14,-102.98,"plains"),
("st_george_ut","聖喬治","St. George","ut",37.10,-113.58,"desert"),
("cedar_city_ut","錫達城","Cedar City","ut",37.68,-113.06,"desert"),
("richfield_ut","里奇菲爾德","Richfield","ut",38.77,-112.08,"desert"),
("gallup_nm","蓋洛普","Gallup","nm",35.53,-108.74,"desert"),
("holbrook_az","霍爾布魯克","Holbrook","az",34.90,-110.16,"desert"),
("west_palm_fl","西棕櫚灘","West Palm Beach","fl",26.72,-80.05,"south"),
("melbourne_fl","墨爾本","Melbourne","fl",28.08,-80.61,"south"),
("columbia_sc","哥倫比亞","Columbia","sc",34.00,-81.03,"south"),
("charleston_sc","查爾斯頓","Charleston","sc",32.78,-79.93,"south"),
("greenville_sc","格林維爾","Greenville","sc",34.85,-82.39,"south"),
("sioux_falls_sd","蘇福爾斯","Sioux Falls","sd",43.55,-96.70,"plains"),
("rapid_city_sd","拉皮德城","Rapid City","sd",44.08,-103.23,"plains"),
("pierre_sd","皮爾","Pierre","sd",44.37,-100.35,"plains"),
("knoxville_tn","諾克斯維爾","Knoxville","tn",35.96,-83.92,"south"),
("chattanooga_tn","查塔努加","Chattanooga","tn",35.05,-85.31,"south"),
("dallas_tx","達拉斯","Dallas","tx",32.78,-96.80,"plains"),
("houston_tx","休士頓","Houston","tx",29.76,-95.37,"south"),
("austin_tx","奧斯汀","Austin","tx",30.27,-97.74,"south"),
("san_antonio_tx","聖安東尼奧","San Antonio","tx",29.42,-98.49,"south"),
("el_paso_tx","埃爾帕索","El Paso","tx",31.76,-106.49,"desert"),
("midland_tx","米德蘭","Midland","tx",31.997,-102.08,"desert"),
("abilene_tx","阿比林","Abilene","tx",32.45,-99.73,"plains"),
("amarillo_tx","阿馬里洛","Amarillo","tx",35.22,-101.83,"plains"),
("lubbock_tx","拉伯克","Lubbock","tx",33.58,-101.86,"plains"),
("salt_lake_ut","鹽湖城","Salt Lake City","ut",40.76,-111.89,"desert"),
("provo_ut","普羅沃","Provo","ut",40.23,-111.66,"desert"),
("green_river_ut","格林河","Green River","ut",38.99,-110.16,"desert"),
("price_ut","普萊斯","Price","ut",39.60,-110.81,"desert"),
("burlington_vt","伯靈頓","Burlington","vt",44.48,-73.21,"ne"),
("rutland_vt","拉特蘭","Rutland","vt",43.61,-72.97,"ne"),
("richmond_va","里士滿","Richmond","va",37.54,-77.44,"ne"),
("norfolk_va","諾福克","Norfolk","va",36.85,-76.29,"ne"),
("roanoke_va","羅阿諾克","Roanoke","va",37.27,-79.94,"ne"),
("seattle_wa","西雅圖","Seattle","wa",47.61,-122.33,"pacific"),
("spokane_wa","斯波坎","Spokane","wa",47.66,-117.43,"pacific"),
("yakima_wa","亞基馬","Yakima","wa",46.60,-120.51,"pacific"),
("charleston_wv","查爾斯頓","Charleston","wv",38.35,-81.63,"ne"),
("morgantown_wv","摩根敦","Morgantown","wv",39.63,-79.96,"ne"),
("green_bay_wi","格林貝","Green Bay","wi",44.51,-88.02,"plains"),
("cheyenne_wy","夏延","Cheyenne","wy",41.14,-104.82,"plains"),
("casper_wy","卡斯珀","Casper","wy",42.87,-106.31,"plains"),
("rock_springs_wy","羅克斯普林斯","Rock Springs","wy",41.59,-109.22,"desert"),
("sheridan_wy","謝里丹","Sheridan","wy",44.80,-106.96,"plains"),
]
NEW = [c for c in NEW if not c[0].endswith("_keep")]

def miles(a, b):
    rad = math.pi/180
    dlat = (b[0]-a[0])*rad
    dlng = (b[1]-a[1])*rad
    lat1, lat2 = a[0]*rad, b[0]*rad
    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlng/2)**2
    return 3958.8 * 2 * math.atan2(math.sqrt(h), math.sqrt(1-h))

nodes = [{"id": e["id"], "st": e["st"], "lat": e["lat"], "lng": e["lng"]} for e in exist]
for c in NEW:
    nodes.append({"id": c[0], "st": c[3], "lat": c[4], "lng": c[5]})

# sparse edges: up to 3 nearest within 130 miles
LIMIT = 130
edges = set()
for a in nodes:
    scored = []
    for b in nodes:
        if a["id"] == b["id"]:
            continue
        d = miles((a["lat"], a["lng"]), (b["lat"], b["lng"]))
        if 0.2 < d <= LIMIT:
            scored.append((d, b["id"]))
    scored.sort()
    for d, bid in scored[:3]:
        edges.add(tuple(sorted((a["id"], bid))))

far_pairs = [
    ("seattle_wa", "juneau_ak"),
    ("juneau_ak", "anchorage_ak"),
    ("anchorage_ak", "fairbanks_ak"),
    ("los_angeles_ca", "honolulu_hi"),
    ("honolulu_hi", "hilo_hi"),
]
for a, b in far_pairs:
    edges.add(tuple(sorted((a, b))))

parent = {n["id"]: n["id"] for n in nodes}
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x
def union(a, b):
    ra, rb = find(a), find(b)
    if ra != rb:
        parent[rb] = ra
for a, b in edges:
    union(a, b)
# pull components together when the gap is still a long day's drive
for _ in range(80):
    roots = {}
    for n in nodes:
        roots.setdefault(find(n["id"]), []).append(n)
    if len(roots) <= 1:
        break
    best = 1e9
    pair = None
    keys = list(roots)
    for i, ra in enumerate(keys):
        for rb in keys[i + 1:]:
            # leave AK and HI as their own components
            if any(x["st"] in ("ak", "hi") for x in roots[ra]) and any(x["st"] not in ("ak", "hi") for x in roots[ra]):
                pass
            for a in roots[ra]:
                for b in roots[rb]:
                    if a["st"] in ("ak", "hi") or b["st"] in ("ak", "hi"):
                        continue
                    d = miles((a["lat"], a["lng"]), (b["lat"], b["lng"]))
                    if d < best:
                        best = d
                        pair = (a["id"], b["id"])
    if not pair or best > 210:
        print("stop", round(best) if pair else None, pair)
        break
    edges.add(tuple(sorted(pair)))
    union(*pair)
    print("bridge", round(best), pair)

comps = {}
for n in nodes:
    comps.setdefault(find(n["id"]), []).append(n["st"])
print("nodes", len(nodes), "edges", len(edges), "components", len(comps))
for ids in sorted(comps.values(), key=len, reverse=True):
    print(len(ids), sorted(set(ids))[:12])

by_state = {}
for n in nodes:
    by_state.setdefault(n["st"], 0)
    by_state[n["st"]] += 1
missing = [s for s, n in sorted(by_state.items()) if n < 2]
print("states", len(by_state), "under 2", missing)

IMG = {
    "ne": "/art/loc-northeast.jpg",
    "south": "/art/loc-city.jpg",
    "plains": "/art/loc-plains.jpg",
    "desert": "/art/loc-desert.jpg",
    "pacific": "/art/loc-pacific.jpg",
}
STATE_ZH = {
"al":"阿拉巴馬","ak":"阿拉斯加","az":"亞利桑那","ar":"阿肯色","ca":"加利福尼亞","co":"科羅拉多","ct":"康乃狄克","de":"德拉瓦","fl":"佛羅里達","ga":"喬治亞","hi":"夏威夷","id":"愛達荷","il":"伊利諾","in":"印第安納","ia":"愛荷華","ks":"堪薩斯","ky":"肯塔基","la":"路易斯安那","me":"緬因","md":"馬里蘭","ma":"麻薩諸塞","mi":"密西根","mn":"明尼蘇達","ms":"密西西比","mo":"密蘇里","mt":"蒙大拿","ne":"內布拉斯加","nv":"內華達","nh":"新罕布夏","nj":"紐澤西","nm":"新墨西哥","ny":"紐約","nc":"北卡羅來納","nd":"北達科他","oh":"俄亥俄","ok":"奧克拉荷馬","or":"奧勒岡","pa":"賓州","ri":"羅德島","sc":"南卡羅來納","sd":"南達科他","tn":"田納西","tx":"德克薩斯","ut":"猶他","vt":"佛蒙特","va":"維吉尼亞","wa":"華盛頓","wv":"西維吉尼亞","wi":"威斯康辛","wy":"懷俄明",
}
STATE_EN = {
"al":"Alabama","ak":"Alaska","az":"Arizona","ar":"Arkansas","ca":"California","co":"Colorado","ct":"Connecticut","de":"Delaware","fl":"Florida","ga":"Georgia","hi":"Hawaii","id":"Idaho","il":"Illinois","in":"Indiana","ia":"Iowa","ks":"Kansas","ky":"Kentucky","la":"Louisiana","me":"Maine","md":"Maryland","ma":"Massachusetts","mi":"Michigan","mn":"Minnesota","ms":"Mississippi","mo":"Missouri","mt":"Montana","ne":"Nebraska","nv":"Nevada","nh":"New Hampshire","nj":"New Jersey","nm":"New Mexico","ny":"New York","nc":"North Carolina","nd":"North Dakota","oh":"Ohio","ok":"Oklahoma","or":"Oregon","pa":"Pennsylvania","ri":"Rhode Island","sc":"South Carolina","sd":"South Dakota","tn":"Tennessee","tx":"Texas","ut":"Utah","vt":"Vermont","va":"Virginia","wa":"Washington","wv":"West Virginia","wi":"Wisconsin","wy":"Wyoming",
}
STATE_JA = {
"al":"アラバマ","ak":"アラスカ","az":"アリゾナ","ar":"アーカンソー","ca":"カリフォルニア","co":"コロラド","ct":"コネチカット","de":"デラウェア","fl":"フロリダ","ga":"ジョージア","hi":"ハワイ","id":"アイダホ","il":"イリノイ","in":"インディアナ","ia":"アイオワ","ks":"カンザス","ky":"ケンタッキー","la":"ルイジアナ","me":"メーン","md":"メリーランド","ma":"マサチューセッツ","mi":"ミシガン","mn":"ミネソタ","ms":"ミシシッピ","mo":"ミズーリ","mt":"モンタナ","ne":"ネブラスカ","nv":"ネバダ","nh":"ニューハンプシャー","nj":"ニュージャージー","nm":"ニューメキシコ","ny":"ニューヨーク","nc":"ノースカロライナ","nd":"ノースダコタ","oh":"オハイオ","ok":"オクラホマ","or":"オレゴン","pa":"ペンシルベニア","ri":"ロードアイランド","sc":"サウスカロライナ","sd":"サウスダコタ","tn":"テネシー","tx":"テキサス","ut":"ユタ","vt":"バーモント","va":"バージニア","wa":"ワシントン","wv":"ウェストバージニア","wi":"ウィスコンシン","wy":"ワイオミング",
}
STATE_KO = {
"al":"앨라배마","ak":"알래스카","az":"애리조나","ar":"아칸소","ca":"캘리포니아","co":"콜로라도","ct":"코네티컷","de":"델라웨어","fl":"플로리다","ga":"조지아","hi":"하와이","id":"아이다호","il":"일리노이","in":"인디애나","ia":"아이오와","ks":"캔자스","ky":"켄터키","la":"루이지애나","me":"메인","md":"메릴랜드","ma":"매사추세츠","mi":"미시간","mn":"미네소타","ms":"미시시피","mo":"미주리","mt":"몬태나","ne":"네브래스카","nv":"네바다","nh":"뉴햄프셔","nj":"뉴저지","nm":"뉴멕시코","ny":"뉴욕","nc":"노스캐롤라이나","nd":"노스다코타","oh":"오하이오","ok":"오클라호마","or":"오리건","pa":"펜실베이니아","ri":"로드아일랜드","sc":"사우스캐롤라이나","sd":"사우스다코타","tn":"테네시","tx":"텍사스","ut":"유타","vt":"버몬트","va":"버지니아","wa":"워싱턴","wv":"웨스트버지니아","wi":"위스콘신","wy":"와이오밍",
}

new_by_id = {c[0]: c for c in NEW}
nbr = {n["id"]: set() for n in nodes}
for a, b in edges:
    # only attach edges that touch a new town, or a far hop. don't rewrite the old KY web more than the new links.
    if a in new_by_id or b in new_by_id or (a, b) in [(x, y) if x < y else (y, x) for x, y in far_pairs]:
        nbr[a].add(b)
        nbr[b].add(a)

lines = []
lines.append('import type { LocationDef } from "./data";\n')
lines.append("export const ATLAS: LocationDef[] = [\n")
for c in NEW:
    cid, zh, en, st, lat, lng, img = c
    neighbors = sorted(nbr[cid])
    # drop neighbors that are new? keep all
    njson = ", ".join(f'"{x}"' for x in neighbors)
    size = "city" if img in ("pacific", "ne") and lat % 1 < 0.5 else "town"
    zombies = 12 + (abs(hash(cid)) % 18)
    lines.append(f"""  {{
    id: "{cid}",
    name: "{zh}",
    nameEn: "{en}",
    state: "{STATE_ZH[st]}",
    region: "{st}",
    size: "{size}",
    blurb: "{en}。{STATE_EN[st]}。",
    desc: "從這裡再往下一個鎮，大約是一天的路。街上沒有車。",
    zombies: {zombies},
    fuel: 2,
    image: "{IMG[img]}",
    zones: ["市區", "倉庫", "主街"],
    loot: {{ food: [2, 6], materials: [2, 6], water: [1, 3] }},
    survivorChance: 0.22,
    occupyCapacity: 8,
    occupyFacilities: {{ beds: 1, kitchen: 1 }},
    occupyBarricade: 40,
    neighbors: [{njson}],
    lat: {lat},
    lng: {lng},
  }},
""")
lines.append("];\n\nexport const ATLAS_EDGES: [string, string][] = [\n")
seen = set()
for a, b in sorted(edges):
    if a in new_by_id or b in new_by_id:
        lines.append(f'  ["{a}", "{b}"],\n')
lines.append("];\n")
(ROOT / "src/game/atlas.ts").write_text("".join(lines))

def dump(table, prefix):
    out = []
    for st, name in table.items():
        out.append(f'  "state.{st}": "{name}",\n')
    for c in NEW:
        cid, zh, en, st, lat, lng, img = c
        local = {"zh": zh, "en": en, "ja": en, "ko": en}[prefix]
        out.append(f'  "loc.{cid}": "{local}",\n')
        desc = {
            "zh": f"{zh}在{STATE_ZH[st]}。再往下一個鎮，大約是一天的路。",
            "en": f"{en}, {STATE_EN[st]}. The next town is about a day on the road.",
            "ja": f"{en}、{STATE_JA[st]}。次の町までおよそ一日。",
            "ko": f"{en}, {STATE_KO[st]}. 다음 마을까지 대략 하루.",
        }[prefix]
        out.append(f'  "loc.{cid}.desc": "{desc}",\n')
    return "".join(out)

copy = "export const atlasZh: Record<string, string> = {\n" + dump(STATE_ZH, "zh") + "};\n"
copy += "export const atlasEn: Record<string, string> = {\n" + dump(STATE_EN, "en") + "};\n"
copy += "export const atlasJa: Record<string, string> = {\n" + dump(STATE_JA, "ja") + "};\n"
copy += "export const atlasKo: Record<string, string> = {\n" + dump(STATE_KO, "ko") + "};\n"
(ROOT / "src/game/atlasCopy.ts").write_text(copy)
print("wrote", len(NEW), "towns")
