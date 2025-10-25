    function change() {
        document.body.style.backgroundColor = "black";
        var bulb = document.getElementById("light-bulb");
        var switchbtn = document.getElementById("switch-btn");
        if (switchbtn.textContent=="ON") {
            document.body.style.backgroundColor = "yellow";
            bulb.src="on.jpeg";
            switchbtn.textContent = "OFF";
        }
        else {
            bulb.src="off.jpeg";
            switchbtn.textContent = "ON";
        }

}
