const visualData={
  thesis:[
    ["Define AOI","The user draws or selects the area of interest; its geometry becomes the spatial contract for search, clipping, analytics and history.","A stable AOI identifier prevents results from different study areas being mixed."],
    ["Acquire event","Search Sentinel-1 GRD scenes and group only compatible adjacent slices: same date, relative orbit and pass direction.","One acquisition context is treated as one event; the normal workflow does not depend on a pre-event SAR baseline."],
    ["Prepare VV","Clip or mosaic the compatible slices, convert VV backscatter to decibels and write cloud-optimised rasters.","The preparation record retains scene identifiers and processing parameters for reproducibility."],
    ["Detect flood","Otsu provides an adaptive intensity split; morphological Chan–Vese and a 3×3 majority filter regularise the flood candidate region.","The stages separate statistical thresholding from spatial refinement, making each assumption inspectable."],
    ["Separate water","A 365-day Dynamic World lookback estimates persistent water. At least three observations and 80% persistence are required.","The output encodes land, event flood, permanent water and outside-AOI/NoData as distinct classes."],
    ["Estimate depth","FABDEM supplies terrain elevation; FwDET assigns each flooded pixel the elevation of its nearest flood boundary and subtracts local terrain.","Negative estimates are clipped to zero because water depth cannot be negative."],
    ["Measure exposure","Depth and extent intersect crop layers, building footprints and buffered roads; domain-specific thresholds convert depth to risk classes.","Exposure is reported separately from hazard so users can see how a consequence was derived."],
    ["Serve & observe","COG, GeoJSON and JSON products flow through FastAPI and TiTiler to a Next.js/MapLibre dashboard with AOI-event history.","The AIOps roadmap adds scheduling, health checks, retries, quality gates and governed cloud deployment around this observable pipeline."]
  ],
  quant:[
    ["Hypothesis","Write the economic intuition before selecting an expression. This prevents metric-first curve fitting."],
    ["Data","Choose fields whose meaning, coverage, delay and universe match the hypothesis."],
    ["Expression","Combine valid operators and transforms into a parsimonious candidate model."],
    ["Simulate","Measure returns, risk, drawdown and turnover over the defined universe."],
    ["Stress-test","Change settings, periods and assumptions; reject unstable or overly complex behaviour."],
    ["Document","Record rationale, lineage, constraints and failures so the experiment is reproducible."]
  ]
};
function makeStepper(target,key,title){
  const host=document.querySelector(target);if(!host)return;
  const data=visualData[key];
  host.insertAdjacentHTML("beforeend",`<div class="explainer" data-explainer="${key}"><div class="visual-head"><div><small>INTERACTIVE WALKTHROUGH</small><h3>${title}</h3></div><span>Choose a stage</span></div><div class="step-tabs">${data.map((d,i)=>`<button class="${i?"":"on"}" data-i="${i}"><b>${String(i+1).padStart(2,"0")}</b>${d[0]}</button>`).join("")}</div><div class="step-detail" aria-live="polite"><span>01 / ${data.length}</span><h3>${data[0][0]}</h3><p>${data[0][1]}</p>${data[0][2]?`<small>${data[0][2]}</small>`:""}</div></div>`);
  const box=host.querySelector(`[data-explainer="${key}"]`),detail=box.querySelector(".step-detail");
  box.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{const i=+btn.dataset.i,d=data[i];box.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b===btn));detail.innerHTML=`<span>${String(i+1).padStart(2,"0")} / ${data.length}</span><h3>${d[0]}</h3><p>${d[1]}</p>${d[2]?`<small>${d[2]}</small>`:""}`}));
}
makeStepper("#thesis section:first-of-type","thesis","Follow one operational event");
makeStepper("#worldquant section:first-of-type","quant","From research idea to defensible evidence");

function makeGallery(target,items,title,intro){
  const host=document.querySelector(target);if(!host)return;
  const id="gallery-"+target.replace(/[^a-z]/gi,"");
  host.insertAdjacentHTML("beforeend",`<div class="evidence-gallery" id="${id}"><div class="visual-head"><div><small>VISUAL EVIDENCE</small><h3>${title}</h3></div><p>${intro}</p></div><div class="gallery-tabs" role="tablist">${items.map((x,i)=>`<button class="${i?"":"on"}" data-i="${i}" aria-selected="${!i}">${x[0]}</button>`).join("")}</div><figure><img src="${items[0][1]}" alt="${items[0][2]}"><figcaption><b>${items[0][0]}.</b> ${items[0][3]}</figcaption></figure></div>`);
  const box=document.getElementById(id),img=box.querySelector("img"),cap=box.querySelector("figcaption");
  box.querySelectorAll(".gallery-tabs button").forEach(btn=>btn.addEventListener("click",()=>{const x=items[+btn.dataset.i];box.querySelectorAll("button").forEach(b=>{b.classList.toggle("on",b===btn);b.setAttribute("aria-selected",b===btn)});img.src=x[1];img.alt=x[2];cap.innerHTML=`<b>${x[0]}.</b> ${x[3]}`}));
}
makeGallery("#antariksh section",[
  ["Data","assets/antariksh-preprocessing.png","Paired optical and SAR samples with dataset split and normalization","7,180 training, 3,255 validation and 3,248 test pairs are normalized separately because optical reflectance and SAR backscatter have different numeric ranges."],
  ["Architecture","assets/antariksh-architecture.png","Bidirectional Antariksh-JEPA model architecture","Separate ViT encoders predict masked cross-modal representations; retrieval-aware objectives align semantic neighbours before binary hashing."],
  ["Training","assets/antariksh-training.png","Training and validation loss across 100 epochs","Training loss continues to fall while validation loss reaches its minimum near epoch 36 and then rises, making checkpoint selection important."],
  ["Results","assets/antariksh-results.png","Original versus contrastive JEPA retrieval metrics","Contrastive training raises held-out label-overlap mAP@10 from about 0.65 to 0.90–0.94 in both directions."],
  ["Examples","assets/antariksh-retrieval.png","Qualitative optical and SAR retrieval examples","Examples distinguish exact-pair retrieval from semantically related top results, showing both capability and remaining ambiguity."]
],"Read the experiment in order","Each tab connects a claim to the figure that supports it.");
makeGallery("#buildings section",[
  ["Fine-tuning","assets/building-finetune.png","Pretrained feature learning and building-mask fine-tuning workflow","Pretrained visual features provide edges, corners and textures; task-specific tiles and masks adapt those features to building instances."],
  ["Instance segmentation","assets/building-visual.png","Multi-scale building instance segmentation and polygon output","The feature pyramid supports different building sizes, while separate masks retain individual structures before vectorisation."]
],"See the model before reading the terminology","These diagrams connect the aerial image, learned features, masks and final GIS polygons.");

const track=document.querySelector("#tracking section");if(track){track.insertAdjacentHTML("beforeend",`<div class="scenario"><div class="visual-head"><div><small>GEOMETRY EXPLAINER</small><h3>Why calibration changes by scene</h3></div></div><div class="scenario-tabs"><button class="on" data-s="scale">Static scale</button><button data-s="road">Road homography</button><button data-s="glacier">Glacier PnP</button></div><div class="scenario-stage" aria-live="polite"></div></div>`);
const stage=track.querySelector(".scenario-stage"),content={
scale:`<div class="scale-line"><i></i><i></i><span>p₁ = 82 px</span><b>→</b><i></i><i></i><span>p₂ = 318 px</span></div><p><code>s = known distance / pixel distance</code></p><p>A planar reference converts 236 pixels into metric distance. This works only when the measured object is on the calibrated plane.</p>`,
road:`<div class="warp"><div class="trapezoid">camera view</div><b>H</b><div class="rectangle">metric road plane</div></div><p><code>x′ ~ Hx</code></p><p>Four non-collinear road points solve the projective transform, removing perspective before pixel displacement becomes velocity.</p>`,
glacier:`<div class="pnp"><span>Camera</span><i></i><div><b>GCP₁</b><b>GCP₂</b><b>GCP₃</b><b>GCP₄</b></div></div><p><code>image point ~ K[R|t] ground point</code></p><p>Known 3D ground points and 2D image observations estimate camera pose, letting tracked motion be interpreted in ground coordinates.</p>`};
function setScenario(k){stage.innerHTML=content[k];track.querySelectorAll(".scenario-tabs button").forEach(b=>b.classList.toggle("on",b.dataset.s===k))}setScenario("scale");track.querySelectorAll(".scenario-tabs button").forEach(b=>b.onclick=()=>setScenario(b.dataset.s));}

const qa=document.querySelector("#pixxel section");if(qa){qa.insertAdjacentHTML("beforeend",`<div class="qa-chart"><div class="visual-head"><div><small>MEASURED SCREENING OUTPUT</small><h3>Candidate anomaly rate by band</h3></div><span>Same |Zr| &gt; 5 threshold</span></div><div class="bars" role="img" aria-label="Band 1 candidate rate 7.423 percent, Band 2 2.358 percent, Band 3 0.728 percent"><div><span>Band 1</span><i style="--v:74.23%"></i><b>7.423%</b></div><div><span>Band 2</span><i style="--v:23.58%"></i><b>2.358%</b></div><div><span>Band 3</span><i style="--v:7.28%"></i><b>0.728%</b></div></div><p>Bar length is scaled to a 10% reference, not evidence that every highlighted pixel is defective. Natural edges can also produce large residuals.</p></div>`);}

document.querySelectorAll("[data-mini-gallery]").forEach(gallery=>{
  const image=gallery.querySelector("img"),caption=gallery.querySelector("figcaption");
  gallery.querySelectorAll(".mini-tabs button").forEach(button=>button.addEventListener("click",()=>{
    gallery.querySelectorAll("button").forEach(item=>item.classList.toggle("on",item===button));
    image.src=button.dataset.src;image.alt=button.dataset.cap;caption.textContent=button.dataset.cap;
  }));
});

const lightbox=document.createElement("dialog");lightbox.className="lightbox";lightbox.innerHTML=`<button aria-label="Close image">×</button><img alt=""><p></p>`;document.body.append(lightbox);
lightbox.querySelector("button").onclick=()=>lightbox.close();lightbox.addEventListener("click",event=>{if(event.target===lightbox)lightbox.close()});
document.querySelectorAll("figure.zoomable img").forEach(img=>{img.tabIndex=0;img.setAttribute("role","button");img.setAttribute("aria-label",`${img.alt}. Open larger view`);const open=()=>{lightbox.querySelector("img").src=img.src;lightbox.querySelector("img").alt=img.alt;lightbox.querySelector("p").textContent=img.closest("figure").querySelector("figcaption")?.textContent||img.alt;lightbox.showModal()};img.onclick=open;img.onkeydown=event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();open()}}});
