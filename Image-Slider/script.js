



var inItSlider = () => {

    const imageSlider = document.querySelector(".slider-wrapper");
    const slideButton = document.querySelectorAll(".slide-button");
    const imageList = document.querySelector(".image-list");
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
    const scrollbar = document.querySelector(".scrollbar");
    const scrollbarThumb = document.querySelector(".scrollbar-thumb");



    scrollbarThumb.addEventListener("mousedown",(e)=>{
        const startX = e.clientX;
        const scrollPosition = scrollbarThumb.offsetLeft;

        const handleMouseMove = (e)=>{
            const deltaX = e.clientX - startX;
            const newthumbPosition = scrollPosition + deltaX;
            const boundingThumbPosition = scrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;
            const finalThumbPosition = Math.max(0,Math.min(newthumbPosition,boundingThumbPosition))
            scrollbarThumb.style.left = `${finalThumbPosition}px`;
            const imgScroll = Math.round ((finalThumbPosition/boundingThumbPosition)*(maxScrollLeft));
            imageList.scrollLeft = imgScroll;   
        }
        const handleMouseUp = ()=>{
            document.removeEventListener("mousemove",handleMouseMove);
            document.removeEventListener("mouseup",handleMouseUp);
        }
        document.addEventListener("mousemove",handleMouseMove);
        document.addEventListener("mouseup",handleMouseUp);
    });

    

    slideButton.forEach(function (button) {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });

        const handleSlideButton = () => {
            slideButton[0].style.display = imageList.scrollLeft <= 0 ? "none" : "block";
            slideButton[1].style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "block";

        };
        const updateScrollbarThumb = () => {
            const scrollPosition = imageList.scrollLeft;
            let thumbPosition = (scrollPosition / maxScrollLeft) * (scrollbar.clientWidth - scrollbarThumb.offsetWidth);
            scrollbarThumb.style.left = `${thumbPosition}px`;
        };


        imageList.addEventListener("scroll", () => {
            handleSlideButton();
            updateScrollbarThumb();
        });



    });


};




window.addEventListener("load", inItSlider);




