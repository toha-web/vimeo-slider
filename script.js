const videos = [];

async function getVideos(){
    const response = await fetch("https://api.vimeo.com/users/23268541/videos", {
        method: "GET",
        headers: {
            Authorization: "bearer d9d0fb5cbeadce7801c80208831ce004",
        },
    });
    const data = await response.json();

    return data;
}
getVideos().then(data => {
    for(let i = 0; i < 8; i++){
        videos.push(data.data[`1${i}`])
    }
    document.querySelector(".wrapper").append(createSliderHtml("main", videos));
    sliderInit("main", {
        slidesPerView: 4,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    }).on("click", (e) => {
        createModal(e.clickedSlide.dataset.swiperSlideIndex);
    });
})


function createSliderHtml(id, videos){
    const slider = document.createElement("div");
    slider.className = "swiper";
    slider.setAttribute("id", `${id}`)

    const slideWrapper = document.createElement("div");
    slideWrapper.className = "swiper-wrapper";

    videos.forEach(video => {
        const videoId = video.uri.split("/").at(-1);
        const div = document.createElement("div");
        div.className = "swiper-slide";
        if(id === "main"){
            const slide = document.createElement("img");
            slide.src = `${video.pictures.sizes[5].link_with_play_button}`;
            div.append(slide);
        }
        else if(id === "modal"){
            div.player = new Vimeo.Player(div, {
                id: `${videoId}`,
                width: video.width,
                responsive: true,
            });
        }
        slideWrapper.append(div);
    });
        
    slider.append(slideWrapper);

    if(id === "main"){
        const prev = document.createElement("div");
        prev.className = "swiper-button-prev";
        const next = document.createElement("div");
        next.className = "swiper-button-next";
        slider.append(prev, next);
    }
    else if(id === "modal") {
        const nav = document.createElement("div");
        nav.className = "swiper-pagination";
        slider.append(nav);
    }

    return slider;
}

function createModal(index) {
    const modal = document.createElement("div");
    modal.className = "modal";

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.innerText = "X";
    closeBtn.addEventListener("click", () => {
        modal.remove();
    });

    const frame = document.createElement("div");
    frame.className = "frame";

    frame.append(closeBtn, createSliderHtml("modal", videos));
    modal.append(frame);
    document.body.append(modal);

    const modalSlider = sliderInit("modal", {
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        on: {
            init: (e) => {
                e.slides.forEach((slide) => {
                    slide.player.pause();
                    if (slide.className.includes("active")) {
                        slide.player.play();
                    }
                });
            },
        },
    });
    modalSlider.slideToLoop(index, 1);
    modalSlider.on("slideChangeTransitionEnd", (e) => {
        e.slides.forEach((slide) => {
            slide.player.pause();
            if (slide.className.includes("active")) {
                slide.player.play();
            }
        });
    });
}

function sliderInit(id, params = {}){
    return new Swiper(`#${id}`, params);
}