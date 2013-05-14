if(window.Animate == null) {
    console.log("Slide.js requires Animate.js");
    Require.script("js/Animate.js");
}
if(window.Dom == null) {
    console.log("Slide.js requires Content.js");
    Require.script("js/Content.js");
}
function Slide(container, sliderData, width) {
    Dom.el(container).innerHTML = '<div id="' + container + 'Slide"></div>' + 
                                '<div id="' + container + 'Thumb"></div>' +
                                '<br />' +
                                '<div id="' + container + 'Left" >left</div>' +
                                '<div id="' + container + 'Right" >right</div>';
    var sliderLeft = Dom.el(container + "Left");
    var sliderRight = Dom.el(container + "Right");
    
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
        
        var content = Dom.el(slider.getBuilderID());
        
        Animate.to(Dom.el(slider.getBuilderID()), 1000, { left:slider.getCurrentSelected() * width * -1 }, Animate.ELASTIC_OUT);
        
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
    
    
    Dom.el(container + "Slide").innerHTML += slider.getContent();
    Dom.el(container + "Thumb").innerHTML += sliderThumb.getContent();
    Dom.el("slider").style.width = slider.getList().length * width + "px";
    
    
    sliderLeft.onclick = function() {
        activateSlide(slideToLeft());
    }
    sliderRight.onclick = function() {
        activateSlide(slideToRight());
    }
    
    initSlide();
    activateSlide(0);
    
}