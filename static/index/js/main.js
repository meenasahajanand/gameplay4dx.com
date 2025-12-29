// fastclick - exclude swiper containers and play buttons to allow touch scrolling and clicks
window.addEventListener('load', function() {
    try {
        var fastClick = new FastClick(document.body);
        // Exclude swiper containers and play buttons from FastClick
        if (fastClick) {
            var excludeSelectors = '.swiper_box, .swiper_box_2, .swiper-wrapper, .swiper-slide, .iframe_box .action, .iframe_box .action a';
            document.addEventListener('touchstart', function(e) {
                var target = e.target;
                var excludeElement = target.closest && target.closest(excludeSelectors);
                if (excludeElement) {
                    if (fastClick.needsClick && typeof fastClick.needsClick === 'function') {
                        fastClick.needsClick(target);
                    }
                    // Don't stop propagation for swiper, but allow play button to work
                    if (excludeElement.closest('.iframe_box .action')) {
                        // Allow play button to handle its own events
                    }
                }
            }, false);
        }
    } catch(e) {
        console.log('FastClick initialization error:', e);
    }
}, false);
//图片懒加载
let lazyImg = document.querySelectorAll('.lazy');
if (lazyImg.length) {
    new LazyLoad({})
};
//响应结构调整
let nav_mask = document.getElementById("nav_mask");
let nav_main = nav_mask.querySelector(".nav_main");
let search_mask = document.getElementById("search_mask");
let saerch_main = search_mask.querySelector(".search_main");
let branch_nav = document.querySelector(".branch_nav");
let top_nav = branch_nav.querySelector(".top_nav");
let category = branch_nav.querySelector(".category");
let sub_nav = category.querySelector(".sub_nav");
let search_pat = document.querySelector(".search_pat");
let mobile_memu_btn = document.querySelector(".mobile_memu_btn");
let mobile_search_btn = document.querySelector(".mobile_search_btn");
const  response_html = ()  => {
    let widowWidth  = document.documentElement.clientWidth || document.body.clientWidth;
    if(widowWidth <= 770 ){
        if(!saerch_main.contains(search_pat))saerch_main.prepend(search_pat);
        if(!nav_main.contains(top_nav)){
            nav_main.append(top_nav,sub_nav);
        }
    }else{
        if(saerch_main.contains(search_pat))mobile_search_btn.before(search_pat);
        if(nav_main.contains(top_nav)){
            category.before(top_nav);
            category.append(sub_nav);
        }
    }
}
response_html();
window.addEventListener('resize',_.debounce(response_html,100));
mobile_memu_btn.addEventListener("click",(e)=>{
    e.currentTarget.classList.toggle("active");
    nav_mask.classList.toggle("active");
});
nav_mask.addEventListener("click",(e)=>{
    if(e.target === e.currentTarget) {
        mobile_memu_btn.classList.remove('active');
        e.currentTarget.classList.remove('active');
    }
});
mobile_search_btn.addEventListener("click",(e)=>{
    e.currentTarget.classList.toggle("active");
    search_mask.classList.toggle("active");
});
search_mask.addEventListener("click",(e)=>{
    if(e.target === e.currentTarget) {
        mobile_search_btn.classList.remove('active');
        e.currentTarget.classList.remove('active');
    }
});
window.addEventListener("click",(e)=>{
    let paths = e.composedPath();
    if(!paths.includes(mobile_memu_btn) && !paths.includes(nav_mask) && mobile_memu_btn.classList.contains('active')){
        mobile_memu_btn.classList.remove('active');
        nav_mask.classList.remove('active');
    }
    if(!paths.includes(mobile_search_btn) && !paths.includes(search_mask) && mobile_search_btn.classList.contains('active')){
        mobile_search_btn.classList.remove('active');
        search_mask.classList.remove('active');
    }
});

// Define full_iframe function for mobile fullscreen
function full_iframe() {
    var iframeBox = document.querySelector('.iframe_box');
    if (iframeBox) {
        iframeBox.classList.add('active');
    }
}

// Fix play button for mobile touch events - run immediately and on DOM ready
(function() {
    function initPlayButtons() {
        // Handle play button clicks in iframe_box
        var playButtons = document.querySelectorAll('.iframe_box .action a');
        playButtons.forEach(function(btn) {
            // Skip if already processed
            if (btn.dataset.playHandlerAdded === 'true') {
                return;
            }
            
            // Remove inline javascript and add proper event listener
            if (btn.href && (btn.href.indexOf('javascript:') === 0 || btn.href.indexOf('classList.add') !== -1)) {
                btn.href = 'javascript:void(0);';
                btn.dataset.playHandlerAdded = 'true';
                
                // Add click and touch event listeners
                function handlePlayClick(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var iframeBox = btn.closest('.iframe_box');
                    if (iframeBox) {
                        iframeBox.classList.add('active');
                    }
                    return false;
                }
                
                // Use capture phase to ensure it fires before other handlers
                btn.addEventListener('click', handlePlayClick, true);
                btn.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePlayClick(e);
                }, true);
            }
        });
        
        // Handle mobile_tag and full_play buttons
        var mobileTagButtons = document.querySelectorAll('.mobile_tag, .full_play');
        mobileTagButtons.forEach(function(btn) {
            // Skip if already processed
            if (btn.dataset.fullIframeHandlerAdded === 'true') {
                return;
            }
            
            if (btn.href && btn.href.indexOf('javascript:full_iframe') !== -1) {
                btn.href = 'javascript:void(0);';
                btn.dataset.fullIframeHandlerAdded = 'true';
                
                function handleFullIframe(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    full_iframe();
                    return false;
                }
                
                btn.addEventListener('click', handleFullIframe, true);
                btn.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFullIframe(e);
                }, true);
            }
        });
    }
    
    // Run immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlayButtons);
    } else {
        initPlayButtons();
    }
    
    // Also run on window load as backup
    window.addEventListener('load', function() {
        setTimeout(initPlayButtons, 100);
    });
})();