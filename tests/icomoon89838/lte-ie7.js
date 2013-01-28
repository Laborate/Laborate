/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-folder-open' : '&#xe000;',
			'icon-file' : '&#xe001;',
			'icon-print' : '&#xe002;',
			'icon-users' : '&#xe003;',
			'icon-lock' : '&#xe004;',
			'icon-binoculars' : '&#xe005;',
			'icon-download' : '&#xe007;',
			'icon-upload' : '&#xe006;',
			'icon-briefcase' : '&#xe008;',
			'icon-envelope' : '&#xe009;',
			'icon-search' : '&#xe00a;',
			'icon-file-2' : '&#xe00b;',
			'icon-profile' : '&#xe00c;',
			'icon-file-3' : '&#xe00d;',
			'icon-file-4' : '&#xe00e;',
			'icon-upload-2' : '&#xe00f;',
			'icon-download-2' : '&#xe010;',
			'icon-box-remove' : '&#xe011;',
			'icon-box-add' : '&#xe012;',
			'icon-drawer' : '&#xe013;',
			'icon-drawer-2' : '&#xe014;',
			'icon-drawer-3' : '&#xe015;',
			'icon-cabinet' : '&#xe016;',
			'icon-checkbox-partial' : '&#xe017;',
			'icon-checkbox-unchecked' : '&#xe018;',
			'icon-checkbox-checked' : '&#xe019;',
			'icon-libreoffice' : '&#xe01a;',
			'icon-file-pdf' : '&#xe01b;',
			'icon-file-openoffice' : '&#xe01c;',
			'icon-file-css' : '&#xe01d;',
			'icon-cart' : '&#xe01e;',
			'icon-inbox' : '&#xe01f;',
			'icon-locked' : '&#xe020;',
			'icon-cloud' : '&#xe021;',
			'icon-plus' : '&#xe022;',
			'icon-minus' : '&#xe023;',
			'icon-pencil' : '&#xe024;',
			'icon-switch' : '&#xe025;',
			'icon-address-book' : '&#xe026;',
			'icon-floppy' : '&#xe027;',
			'icon-checkmark' : '&#xe028;',
			'icon-cancel' : '&#xe029;',
			'icon-code' : '&#xe02a;',
			'icon-paperclip' : '&#xe02b;',
			'icon-forward' : '&#xe02c;',
			'icon-check-alt' : '&#xe02d;',
			'icon-x-altx-alt' : '&#xe02e;',
			'icon-plus-alt' : '&#xe02f;',
			'icon-minus-alt' : '&#xe030;',
			'icon-loop-alt2' : '&#xe031;',
			'icon-loop-alt1' : '&#xe032;',
			'icon-arrow-down-alt2' : '&#xe033;',
			'icon-arrow-down-alt1' : '&#xe034;',
			'icon-arrow-up-alt2' : '&#xe035;',
			'icon-arrow-up-alt1' : '&#xe036;',
			'icon-arrow-right-alt2' : '&#xe037;',
			'icon-arrow-left-alt1' : '&#xe038;',
			'icon-arrow-left-alt2' : '&#xe039;',
			'icon-loop-alt3' : '&#xe03a;',
			'icon-loop-alt4' : '&#xe03b;',
			'icon-transfer' : '&#xe03c;',
			'icon-move-vertical' : '&#xe03d;',
			'icon-move-vertical-alt1' : '&#xe03e;',
			'icon-move-vertical-alt2' : '&#xe03f;',
			'icon-reload' : '&#xe040;',
			'icon-reload-alt' : '&#xe041;',
			'icon-layers' : '&#xe042;',
			'icon-pen-alt2' : '&#xe043;',
			'icon-pen' : '&#xe044;',
			'icon-pen-alt-stroke' : '&#xe045;',
			'icon-pen-alt-fill' : '&#xe046;',
			'icon-rss-alt' : '&#xe047;',
			'icon-move-alt2' : '&#xe048;',
			'icon-key-fill' : '&#xe049;',
			'icon-github' : '&#xe04a;',
			'icon-envelope-2' : '&#xe04b;',
			'icon-envelope-3' : '&#xe04c;',
			'icon-mobile' : '&#xe04d;',
			'icon-laptop' : '&#xe04e;',
			'icon-modem' : '&#xe04f;',
			'icon-battery-low' : '&#xe050;',
			'icon-battery' : '&#xe051;',
			'icon-battery-2' : '&#xe052;',
			'icon-battery-full' : '&#xe053;',
			'icon-search-2' : '&#xe054;',
			'icon-zoom-out' : '&#xe055;',
			'icon-zoom-in' : '&#xe056;',
			'icon-binocular' : '&#xe057;',
			'icon-file-5' : '&#xe058;',
			'icon-attachment' : '&#xe059;',
			'icon-bookmark' : '&#xe05a;',
			'icon-trashcan' : '&#xe05b;',
			'icon-user' : '&#xe05c;',
			'icon-user-2' : '&#xe05d;',
			'icon-user-3' : '&#xe05e;',
			'icon-locked-2' : '&#xe05f;',
			'icon-unlocked' : '&#xe060;',
			'icon-key' : '&#xe061;',
			'icon-info' : '&#xe062;',
			'icon-arrow-right' : '&#xe063;',
			'icon-arrow-left' : '&#xe064;',
			'icon-arrow-down' : '&#xe065;',
			'icon-arrow-up' : '&#xe066;',
			'icon-enlarge' : '&#xe067;',
			'icon-contract' : '&#xe068;',
			'icon-refresh' : '&#xe069;',
			'icon-card' : '&#xe06a;',
			'icon-cone' : '&#xe06b;',
			'icon-cart-2' : '&#xe06c;',
			'icon-icons' : '&#xe06d;',
			'icon-list' : '&#xe06e;',
			'icon-notes' : '&#xe06f;',
			'icon-notebook' : '&#xe070;',
			'icon-minus-2' : '&#xe071;',
			'icon-plus-2' : '&#xe072;',
			'icon-arrow-down-2' : '&#xe073;',
			'icon-arrow-up-2' : '&#xe074;',
			'icon-arrow-left-2' : '&#xe075;',
			'icon-arrow-right-2' : '&#xe076;',
			'icon-arrow-down-3' : '&#xe077;',
			'icon-arrow-up-3' : '&#xe078;',
			'icon-arrow-left-3' : '&#xe079;',
			'icon-arrow-right-3' : '&#xe07a;',
			'icon-popout' : '&#xe07b;',
			'icon-popout-2' : '&#xe07c;',
			'icon-redo' : '&#xe07d;',
			'icon-unlocked-2' : '&#xe07e;',
			'icon-locked-3' : '&#xe07f;',
			'icon-broadcast' : '&#xe080;',
			'icon-folder' : '&#xe081;',
			'icon-checklist' : '&#xe082;',
			'icon-drawer-4' : '&#xe083;',
			'icon-envelope-4' : '&#xe084;',
			'icon-rainbow' : '&#xe085;',
			'icon-trashcan-2' : '&#xe086;',
			'icon-crop' : '&#xe087;',
			'icon-bars' : '&#xe088;',
			'icon-list-2' : '&#xe089;',
			'icon-grid' : '&#xe08a;',
			'icon-cloud-2' : '&#xe08b;',
			'icon-cog' : '&#xe08c;',
			'icon-wrench' : '&#xe08d;',
			'icon-paste' : '&#xe08e;',
			'icon-paste-2' : '&#xe08f;',
			'icon-tv' : '&#xe090;',
			'icon-tablet' : '&#xe091;',
			'icon-mobile-2' : '&#xe092;',
			'icon-mobile-3' : '&#xe093;',
			'icon-images' : '&#xe094;',
			'icon-image' : '&#xe095;',
			'icon-image-2' : '&#xe096;',
			'icon-connection' : '&#xe097;',
			'icon-podcast' : '&#xe098;',
			'icon-feed' : '&#xe099;',
			'icon-paint-format' : '&#xe09a;',
			'icon-cart-3' : '&#xe09b;',
			'icon-disk' : '&#xe09c;',
			'icon-storage' : '&#xe09d;',
			'icon-screen' : '&#xe09e;',
			'icon-laptop-2' : '&#xe09f;',
			'icon-keyboard' : '&#xe0a0;',
			'icon-user-4' : '&#xe0a1;',
			'icon-users-2' : '&#xe0a2;',
			'icon-user-5' : '&#xe0a3;',
			'icon-user-6' : '&#xe0a4;',
			'icon-user-7' : '&#xe0a5;',
			'icon-settings' : '&#xe0a6;',
			'icon-equalizer' : '&#xe0a7;',
			'icon-remove' : '&#xe0a8;',
			'icon-download-3' : '&#xe0a9;',
			'icon-upload-3' : '&#xe0aa;',
			'icon-remove-2' : '&#xe0ab;',
			'icon-cloud-upload' : '&#xe0ac;',
			'icon-cloud-download' : '&#xe0ad;',
			'icon-cloud-3' : '&#xe0ae;',
			'icon-thumbs-up' : '&#xe0af;',
			'icon-thumbs-up-2' : '&#xe0b0;',
			'icon-checkmark-2' : '&#xe0b1;',
			'icon-checkmark-3' : '&#xe0b2;',
			'icon-close' : '&#xe0b3;',
			'icon-spam' : '&#xe0b4;',
			'icon-checkmark-circle' : '&#xe0b5;',
			'icon-cancel-circle' : '&#xe0b6;',
			'icon-blocked' : '&#xe0b7;',
			'icon-info-2' : '&#xe0b8;',
			'icon-info-3' : '&#xe0b9;',
			'icon-question' : '&#xe0ba;',
			'icon-notification' : '&#xe0bb;',
			'icon-warning' : '&#xe0bc;',
			'icon-paragraph-left' : '&#xe0bd;',
			'icon-paragraph-center' : '&#xe0be;',
			'icon-paragraph-right' : '&#xe0bf;',
			'icon-paragraph-justify' : '&#xe0c0;',
			'icon-paragraph-left-2' : '&#xe0c1;',
			'icon-paragraph-center-2' : '&#xe0c2;',
			'icon-indent-increase' : '&#xe0c3;',
			'icon-paragraph-justify-2' : '&#xe0c4;',
			'icon-paragraph-right-2' : '&#xe0c5;',
			'icon-indent-decrease' : '&#xe0c6;',
			'icon-embed' : '&#xe0c7;',
			'icon-console' : '&#xe0c8;',
			'icon-code-2' : '&#xe0c9;',
			'icon-scissors' : '&#xe0ca;',
			'icon-crop-2' : '&#xe0cb;',
			'icon-feed-2' : '&#xe0cc;',
			'icon-feed-3' : '&#xe0cd;',
			'icon-feed-4' : '&#xe0ce;',
			'icon-google-plus' : '&#xe0cf;',
			'icon-google-drive' : '&#xe0d0;',
			'icon-facebook' : '&#xe0d1;',
			'icon-facebook-2' : '&#xe0d2;',
			'icon-facebook-3' : '&#xe0d3;',
			'icon-google-plus-2' : '&#xe0d4;',
			'icon-google-plus-3' : '&#xe0d5;',
			'icon-google-plus-4' : '&#xe0d6;',
			'icon-google' : '&#xe0d7;',
			'icon-twitter' : '&#xe0d8;',
			'icon-twitter-2' : '&#xe0d9;',
			'icon-twitter-3' : '&#xe0da;',
			'icon-youtube' : '&#xe0db;',
			'icon-vimeo' : '&#xe0dc;',
			'icon-youtube-2' : '&#xe0dd;',
			'icon-vimeo2' : '&#xe0de;',
			'icon-vimeo-2' : '&#xe0df;',
			'icon-lanyrd' : '&#xe0e0;',
			'icon-flickr' : '&#xe0e1;',
			'icon-flickr-2' : '&#xe0e2;',
			'icon-flickr-3' : '&#xe0e3;',
			'icon-picassa' : '&#xe0e4;',
			'icon-picassa-2' : '&#xe0e5;',
			'icon-html5' : '&#xe0e6;',
			'icon-html5-2' : '&#xe0e7;',
			'icon-file-xml' : '&#xe0e8;',
			'icon-file-excel' : '&#xe0ea;',
			'icon-file-zip' : '&#xe0eb;',
			'icon-file-powerpoint' : '&#xe0ec;',
			'icon-file-word' : '&#xe0e9;',
			'icon-user-8' : '&#xe0ed;',
			'icon-feed-5' : '&#xe0ee;',
			'icon-folder-2' : '&#xe0ef;',
			'icon-file-6' : '&#xe0f0;',
			'icon-picture' : '&#xe0f1;',
			'icon-warning-2' : '&#xe0f2;',
			'icon-monitor' : '&#xe0f3;',
			'icon-mobile-4' : '&#xe0f4;',
			'icon-cone-2' : '&#xe0f5;',
			'icon-move' : '&#xe0f6;',
			'icon-target' : '&#xe0f7;',
			'icon-battery-3' : '&#xe0f8;',
			'icon-credit-card' : '&#xe0f9;',
			'icon-database' : '&#xe0fa;',
			'icon-list-3' : '&#xe0fb;',
			'icon-grid-2' : '&#xe0fc;',
			'icon-volume' : '&#xe0fd;',
			'icon-volume-2' : '&#xe0fe;',
			'icon-tag' : '&#xe0ff;',
			'icon-thumbs-up-3' : '&#xe100;',
			'icon-thumbs-down' : '&#xe101;',
			'icon-earth' : '&#xe102;',
			'icon-location' : '&#xe103;',
			'icon-info-4' : '&#xe104;',
			'icon-comment' : '&#xe105;',
			'icon-checkmark-4' : '&#xe106;',
			'icon-x' : '&#xe107;',
			'icon-denied' : '&#xe108;',
			'icon-document-fill' : '&#xe109;',
			'icon-document-stroke' : '&#xe10a;',
			'icon-document-alt-fill' : '&#xe10b;',
			'icon-document-alt-stroke' : '&#xe10c;',
			'icon-plus-3' : '&#xe10d;',
			'icon-minus-3' : '&#xe10e;',
			'icon-move-2' : '&#xe10f;',
			'icon-move-alt1' : '&#xe110;',
			'icon-calendar' : '&#xe111;',
			'icon-cog-2' : '&#xe112;',
			'icon-lock-fill' : '&#xe113;',
			'icon-lock-stroke' : '&#xe114;',
			'icon-unlock-stroke' : '&#xe115;',
			'icon-unlock-fill' : '&#xe116;',
			'icon-tag-stroke' : '&#xe117;',
			'icon-tag-fill' : '&#xe118;',
			'icon-moon-stroke' : '&#xe119;',
			'icon-moon-fill' : '&#xe11a;',
			'icon-sun-fill' : '&#xe11b;',
			'icon-sun-stroke' : '&#xe11c;',
			'icon-layers-alt' : '&#xe11d;',
			'icon-download-4' : '&#xe11e;',
			'icon-upload-4' : '&#xe11f;',
			'icon-cloud-download-2' : '&#xe120;',
			'icon-cloud-upload-2' : '&#xe121;',
			'icon-fork' : '&#xe122;',
			'icon-paperclip-2' : '&#xe123;',
			'icon-clock' : '&#xe124;',
			'icon-book-alt2' : '&#xe125;',
			'icon-box' : '&#xe126;',
			'icon-folder-stroke' : '&#xe127;',
			'icon-folder-fill' : '&#xe128;',
			'icon-pilcrow' : '&#xe129;',
			'icon-hash' : '&#xe12a;',
			'icon-info-5' : '&#xe12b;',
			'icon-ampersand' : '&#xe12c;',
			'icon-at' : '&#xe12d;',
			'icon-question-mark' : '&#xe12e;',
			'icon-left-quote' : '&#xe12f;',
			'icon-right-quote' : '&#xe130;',
			'icon-left-quote-alt' : '&#xe131;',
			'icon-right-quote-alt' : '&#xe132;',
			'icon-article' : '&#xe133;',
			'icon-read-more' : '&#xe134;',
			'icon-list-4' : '&#xe135;',
			'icon-list-nested' : '&#xe136;',
			'icon-book' : '&#xe137;',
			'icon-book-alt' : '&#xe138;',
			'icon-equalizer-2' : '&#xe139;',
			'icon-key-stroke' : '&#xe13a;',
			'icon-loop' : '&#xe13b;',
			'icon-arrow-left-4' : '&#xe13c;',
			'icon-arrow-right-4' : '&#xe13d;',
			'icon-arrow-up-4' : '&#xe13e;',
			'icon-arrow-down-4' : '&#xe13f;',
			'icon-arrow-right-alt1' : '&#xe140;',
			'icon-move-horizontal-alt2' : '&#xe141;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};