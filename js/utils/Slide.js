if(window.Animate == null) {
    console.log("Slide.js requires Animate.js");
    if(window.Require)
        Require.script("Animate.js");
}
if(window.Selector == null) {
    console.log("Slide.js requires Content.js");
    if(window.Require)
        Require.script("Content.js");
}
function Slide(container, sliderData, width) {
    el(container).innerHTML = '<div id="' + container + 'Slide"></div>' + 
                                '<div id="' + container + 'Thumb"></div>' +
                                '<br />' +
                                '<div id="' + container + 'Left" >left</div>' +
                                '<div id="' + container + 'Right" >right</div>';
    var sliderLeft = el(container + "Left");
    var sliderRight = el(container + "Right");
    
    var slider = new Content("slider");
    slider.setDB(sliderData);
    slider.setDesign('<img src="${image}" />');
    slider.addListener(ContentEvent.CONTENT_SELECT, onSlideSelect);
    function onSlideSelect(e) {
        alert(e.image);
    }
    var slide;
    function initSlide() {
        clearTimeout(slide);
        slide = setTimeout(onTimeOut, 5000);
    }
    function onTimeOut() {
        activateSlide(slideToRight());
    }
    function slideToRight() {
        var newActive;
        if(slider.getCurrentSelected() >= slider.getList().length - 1)
            newActive = 0;
        else
            newActive = slider.getCurrentSelected() + 1;
        return newActive;
    }
    function slideToLeft() {
        var newActive;
        if(slider.getCurrentSelected() <= 0)
            newActive = slider.getList().length - 1;
        else
            newActive = slider.getCurrentSelected() - 1;
        return newActive;
    }
    function activateSlide(e) {
        slider.selectContent(e);
        sliderThumb.selectContent(e);
        
        var content = el(slider.getBuilderID());
        
        Animate.to(el(slider.getBuilderID()), 1000, { left:slider.getCurrentSelected() * width * -1 }, Animate.ELASTIC_OUT);
        
        initSlide();
    }
    var sliderThumb = new Content("thumb");
    sliderThumb.setDB(sliderData);
    sliderThumb.setDesign("<div></div>");
    sliderThumb.addListener(ContentEvent.CONTENT_SELECT, onThumbSelect);
    
    function onThumbSelect(e) {
       var thumbID = e.id;
       activateSlide(thumbID);
    }
    
    
    el(container + "Slide").innerHTML += slider.getContent();
    el(container + "Thumb").innerHTML += sliderThumb.getContent();
    el("slider").style.width = slider.getList().length * width + "px";
    
    
    sliderLeft.onclick = function() {
        activateSlide(slideToLeft());
    }
    sliderRight.onclick = function() {
        activateSlide(slideToRight());
    }
    
    initSlide();
    activateSlide(0);
    
}