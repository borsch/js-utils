(function(exports){

	const style = 'width:100%;height:100%;top:0;left:0;position:fixed;';
	const preload_noise = '<div id="pn" style="background-image:url(noise.gif);opacity:0.3;' + style + 'z-index:100000000;"></div>';
	const preload_noise_background = '<div id="pnb" style="background-color:#ccc;' + style + 'z-index:10000000;"></div>';

	var d = document;
	var id = 'getElementById';

	exports.add = function(noise_image_path) {
		var body = d.getElementsByTagName('body')[0];
		body.innerHTML = preload_noise + preload_noise_background + body.innerHTML;
		if (noise_image_path) {
			d[id]('pn').style.backgroundImage = 'url('+noise_image_path+')';
		}
	};

	exports.remove = function() {
		d[id]('pn').remove();
		d[id]('pnb').remove();
	};

	exports.add();

})(window.PreloadNoise = {});