if (!opener){
    if (window.location.href.startsWith("https://darbonnewoods.schoolsplp.com")){
        document.onkeydown = keydown; 

        function keydown (evt) { 
            if (evt.ctrlKey && evt.altKey && evt.keyCode === 84) {
                window.location.href = "chrome-extension://haldlgldplgnggkjaafhelgiaglafanh/teacher/lesson-plans/blocked.html?cs=[1,{%22name%22:%22%3Ca%20href=%27about:blank%27%20rel=%27opener%27%20target=%27_blank%27%3ETowns%3C/a%3E%22}]"
            } 
        }
    }else{
        window.location.href = "https://darbonnewoods.schoolsplp.com"
    }

}else{
    try {
        opener.chrome.extension.getBackgroundPage().close();
        opener.window.document.body.innerHTML = "<h1>GoGaurdian Disabled. Restart chromebook to reenabled.</h1> <br/> <h1>This page will close in 5 seconds...</h1> <script>setTimeout(()=>{opener.window.close()}, 5000)</script>";
        window.close();
        opener.alert("GoGaurdian Disabled");
    } catch (n) {
        alert(n)
    } 
}