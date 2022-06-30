// window.addEventListener('scroll', function (e) {
// 	// console.log(lazyImages[1].getBoundingClientRect());
// 	console.log(lazyImagesPositions[1]);
// 	console.log(lazyImagesPositions[1] - windowHeight);
// 	console.log(pageYOffset);
// });
"use strict"
const lazyImages = document.querySelectorAll('img[data-src],source[data-srcset]');
const loadVideos = document.querySelectorAll('._load-video');
const loadVideosIframe = document.querySelectorAll('._load-video-iframe');
const loadMapBlock = document.querySelector('._load-map');
const windowHeight = document.documentElement.clientHeight;
const loadMoreBlock = document.querySelector('._load-more');



let lazyImagesPositions = [];
let lazyVideosPositions = [];
let lazyVideosIframePositions = [];



if (lazyImages.length > 0) {
	lazyImages.forEach(img => {
		if (img.dataset.src || img.dataset.srcset) {
			lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset);
			lazyScrollCheck();
		}
	});
};


if (loadVideosIframe.length > 0) {
	loadVideosIframe.forEach(video => {
		if (video.dataset.videoIframe) {
			lazyVideosIframePositions.push(video.getBoundingClientRect().top + pageYOffset);
			lazyVideoIframeScrollCheck();
		}
	});
};


if (loadVideos.length > 0) {
	loadVideos.forEach(loadVideo => {
		lazyVideosPositions.push(loadVideo.getBoundingClientRect().top + pageYOffset);
		loadVideosScrollCheck();
	});
};




window.addEventListener("scroll", lazyScroll);

function lazyScroll() {
	if (document.querySelectorAll('img[data-src],source[data-srcset]').length > 0) {
		lazyScrollCheck();
	}
	if (document.querySelectorAll('._load-video-iframe[data-video-iframe]').length > 0) {
		lazyVideoIframeScrollCheck();
	}
	if (document.querySelectorAll('._load-video').length > 0) {
		loadVideosScrollCheck();
	}
	// if (!loadMapBlock.classList.contains('_loaded')) {
	// 	getMap();
	// }
	// if (!loadMoreBlock.classList.contains('_loading')) {
	// 	loadMore();
	// }
};




function lazyScrollCheck() {
	let imgIndex = lazyImagesPositions.findIndex(
		item => pageYOffset > item - 1000 - windowHeight
	);
	if (imgIndex >= 0) {
		if (lazyImages[imgIndex].dataset.src) {
			lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
			lazyImages[imgIndex].removeAttribute('data-src');
		} else if (lazyImages[imgIndex].dataset.srcset) {
			lazyImages[imgIndex].srcset = lazyImages[imgIndex].dataset.srcset;
			lazyImages[imgIndex].removeAttribute('data-srcset');
		}
		// if (lazyImages[imgIndex].closest('._load-image-icon')) {
		// 	let parentImages = lazyImages[imgIndex].closest('._load-image-icon');
		// 	parentImages.classList.remove('_load-image-icon')
		// }
		delete lazyImagesPositions[imgIndex];
	}
};




function lazyVideoIframeScrollCheck() {
	let videoIndex = lazyVideosIframePositions.findIndex(
		item => pageYOffset > item - 2000 - windowHeight
	);
	if (videoIndex >= 0) {
		if (loadVideosIframe[videoIndex].dataset.videoIframe) {
			const loadVideoUrl = loadVideosIframe[videoIndex].dataset.videoIframe;
			if (loadVideoUrl) {
				loadVideosIframe[videoIndex].insertAdjacentHTML(
					"beforeend",
					`<iframe src="${loadVideoUrl}" title="YouTube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen></iframe>`
				);
				loadVideosIframe[videoIndex].removeAttribute('data-video-iframe');
				loadVideosIframe[videoIndex].classList.remove('_load-video-iframe');
			}
		}
		delete lazyVideosIframePositions[videoIndex];
	}
};



function loadVideosScrollCheck() {
	let loadVideoIndex = lazyVideosPositions.findIndex(
		item => pageYOffset > item - windowHeight
	);
	if (loadVideoIndex >= 0) {
		if (loadVideos[loadVideoIndex].classList.contains('_load-video')) {
			if (loadVideos[loadVideoIndex].dataset.poster) {
				loadVideos[loadVideoIndex].poster = loadVideos[loadVideoIndex].dataset.poster;
				loadVideos[loadVideoIndex].removeAttribute('data-poster');
			};
			let childVideos = loadVideos[loadVideoIndex].children;
			for (let index = 0; index < childVideos.length; index++) {
				const childVideo = childVideos[index];
				if (childVideo.dataset.video) {
					if (childVideo.getAttribute('type') == 'video/webm') {
						childVideo.src = childVideo.dataset.video;
						childVideo.removeAttribute('data-video');
						console.log(childVideo);
					} else if (childVideo.getAttribute('type') == 'video/mp4') {
						childVideo.src = childVideo.dataset.video;
						childVideo.removeAttribute('data-video');
						console.log(childVideo);
					}
				}
			}
			loadVideos[loadVideoIndex].setAttribute('preload', 'auto')
			loadVideos[loadVideoIndex].classList.remove('_load-video')
		}
		delete lazyVideosPositions[loadVideoIndex];
	}
}







function getMap() {
	const loadMapBlockPos = loadMapBlock.getBoundingClientRect().top + pageYOffset;
	if (pageYOffset > loadMapBlockPos - windowHeight) {
		const loadMapUrl = loadMapBlock.dataset.map;
		if (loadMapUrl) {
			loadMapBlock.insertAdjacentHTML(
				"beforeend",
				`<iframe src="${loadMapUrl}" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
			);
			loadMapBlock.classList.add('_loaded');
		}
	}
}


function loadMore() {
	const loadMoreBlockPos = loadMoreBlock.getBoundingClientRect().top + pageYOffset;
	const loadMoreBlockHeight = loadMoreBlock.offsetHeight;

	if (pageYOffset > (loadMoreBlockPos + loadMoreBlockHeight) - windowHeight) {
		getContent();
	}
}

async function getContent() {
	if (!document.querySelector('._loading-icon')) {
		loadMoreBlock.insertAdjacentHTML(
			'beforeend',
			`<div class="_loading-icon"></div>`
		);
	}
	loadMoreBlock.classList.add('_loading');

	let response = await fetch('_more.html', {
		method: 'GET',
	});
	if (response.ok) {
		let result = await response.text();
		loadMoreBlock.insertAdjacentHTML('beforeend', result);
		loadMoreBlock.classList.remove('_loading');
		if (document.querySelector('._loading-icon')) {
			document.querySelector('._loading-icon').remove();
		}
	} else {
		alert("Ошибка");
	}
}
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";


function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
window.onload = function () {
	document.addEventListener("click", documentActions);
	// делегирования события клик
	function documentActions(e) {
		const targetElement = e.target;
		if (window.innerWidth > 991.98 && isMobile.any()) {
			if (targetElement.classList.contains('menu-header__arrow')) {
				targetElement.closest('.menu-header__item').classList.toggle('_active');
			}
			if (!targetElement.closest('.menu-header__item') && document.querySelectorAll('.menu-header__item._active').length > 0) {
				_removeClasses(document.querySelectorAll('.menu-header__item._active'), "_active");
			}
		};
		if (window.innerWidth > 767.98 && isMobile.any()) {
			if (targetElement.classList.contains('menu-cover__arrow')) {
				targetElement.closest('.menu-cover').classList.toggle('_active');
			}
			if (!targetElement.closest('.menu-cover') && document.querySelectorAll('.menu-cover._active').length > 0) {
				_removeClasses(document.querySelectorAll('.menu-cover._active'), "_active");
			}
		}
	};
	window.addEventListener('scroll', scroll_scroll);
	function scroll_scroll() {
		let src_value = pageYOffset;
		let header = document.querySelector('header.header');
		if (header !== null) {
			if (src_value > 50) {
				header.classList.add('_scroll');
			} else {
				header.classList.remove('_scroll');
			}
		}
	};
	// если бы работал на лету isMobile
	if (window.innerWidth > 991.98 && !isMobile.any()) {
		const itemDrops = document.querySelectorAll('[data-drop]');
		for (let index = 0; index < itemDrops.length; index++) {
			const itemDrop = itemDrops[index];
			itemDrop.addEventListener("mouseenter", function (e) {
				itemDrop.closest('.menu-cover').classList.add("_active");
			});
			itemDrop.addEventListener("mouseleave", function (e) {
				itemDrop.closest('.menu-cover').classList.remove("_active");
			});
		};
	};

	let catalogBtn = document.querySelector('.catalog__button');
	catalogBtn.addEventListener('click', function () {
		catalogBtn.closest('.catalog__footer').classList.toggle('_active');
	});
};




var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE");

var isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

function isIE() {
	ua = navigator.userAgent;
	var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
	return is_ie;
}

if (isIE()) {
	document.querySelector('html').classList.add('ie');
}

if (isMobile.any()) {
	document.querySelector('html').classList.add('_touch');
}

//======================

//testWebp
function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
	if (support === true) {
		document.querySelector('html').classList.add('_webp');
	} else {
		document.querySelector('html').classList.add('_no-webp');
	}
});

//======================

//_ibg
function ibg() {
	if (isIE()) {
		let ibg = document.querySelectorAll("._ibg");
		for (var i = 0; i < ibg.length; i++) {
			if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
				ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
			}
		}
	}
}
ibg();

//======================

//wrapper_loaded
window.addEventListener("load", function () {
	if (document.querySelector('.wrapper')) {
		setTimeout(function () {
			document.querySelector('.wrapper').classList.add('_loaded');
		}, 0);
	}
});

let unlock = true;

//=====================

//Menu
let iconMenu = document.querySelector(".icon-header");
if (iconMenu != null) {
	let delay = 200;
	let menuBody = document.querySelector(".menu-header");
	iconMenu.addEventListener("click", function (e) {
		if (unlock) {
			body_lock(delay);
			iconMenu.classList.toggle("_active");
			menuBody.classList.toggle("_active");
		}
	});
};

//=====================

//BodyLock
function body_lock(delay) {
	let body = document.querySelector("body");
	if (body.classList.contains('_lock')) {
		body_lock_remove(delay);
	} else {
		body_lock_add(delay);
	}
}
function body_lock_remove(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			body.classList.remove("_lock");
		}, delay);

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}
function body_lock_add(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		body.classList.add("_lock");

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}


//=====================

//Tabs
let tabs = document.querySelectorAll("._tabs");
for (let index = 0; index < tabs.length; index++) {
	let tab = tabs[index];
	let tabs_items = tab.querySelectorAll("._tabs-item");
	let tabs_blocks = tab.querySelectorAll("._tabs-block");
	for (let index = 0; index < tabs_items.length; index++) {
		let tabs_item = tabs_items[index];
		tabs_item.addEventListener("click", function (e) {
			for (let index = 0; index < tabs_items.length; index++) {
				let tabs_item = tabs_items[index];
				tabs_item.classList.remove('_active');
				tabs_blocks[index].classList.remove('_active');
			}
			tabs_item.classList.add('_active');
			tabs_blocks[index].classList.add('_active');
			e.preventDefault();
		});
	}
}

//=====================

//SPOLLERS
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	// Получение обычных слойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});
	// Инициализация обычных слойлеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	// Получение слойлеров с медиа запросами
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	// Инициализация слойлеров с медиа запросами
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		// Получаем уникальные брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		// Работаем с каждым брейкпоинтом
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			// Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			// Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	// Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	// Работа с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}

//=====================

//SlideToggle
// Анимирует скрытие
let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
// Анимирует показ
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
// Комдинация двох функций
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

//=====================

//IsHidden
function _is_hidden(el) {
	return (el.offsetParent === null)
}

//=====================

//Полифилы
(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();
let bigSlider = new Swiper('.big-slider-cover', {
	slidesPerView: 1,
	slidesPerGroup: 1,
	initialSlide: 0,

	simulateTouch: true,
	touthRadio: 1,
	touthAngle: 45,
	grabCursor: true,

	observer: true,
	observeParents: true,
	autoHeight: false,
	speed: 500,

	keyboard: {
		//включить выкльучит
		//возможность управления
		enabled: true,
		//включить выкльучит
		//стрелками
		//только когда слайдер
		//в пределах вьюпорта
		onlyInViewport: true,
		//включить выкльучит
		//управление клавишами
		//pageUP, pageDown
		pageUpDown: true,
	},

	effect: 'fade',
	fadeEffect: {
		crossFade: true
	}
});

let miniSlider = new Swiper('.mini-slider-cover', {
	slidesPerView: 1,
	slidesPerGroup: 1,
	initialSlide: 0,
	spaceBetween: 10,

	simulateTouch: true,
	touthRadio: 1,
	touthAngle: 45,
	grabCursor: true,

	observer: true,
	observeParents: true,
	autoHeight: false,
	speed: 500,


	pagination: {
		el: '.mini-slider-cover__info',
		type: 'fraction',
	},

	navigation: {
		nextEl: '.mini-slider-cover__button-next',
		prevEl: '.mini-slider-cover__button-prev',
	},
});

bigSlider.controller.control = miniSlider
miniSlider.controller.control = bigSlider

if (document.querySelector('.calculator__slider')) {
	new Swiper('.calculator__slider', {
		slidesPerView: 3,
		slidesPerGroup: 1,
		initialSlide: 0,
		spaceBetween: 1,

		simulateTouch: true,
		touthRadio: 1,
		touthAngle: 45,
		grabCursor: true,

		observer: true,
		observeParents: true,
		autoHeight: false,
		speed: 500,

		keyboard: {
			//включить выкльучит
			//возможность управления
			enabled: true,
			//включить выкльучит
			//стрелками
			//только когда слайдер
			//в пределах вьюпорта
			onlyInViewport: true,
			//включить выкльучит
			//управление клавишами
			//pageUP, pageDown
			pageUpDown: true,
		},

		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			700.98: {
				slidesPerView: 2,
			},
			991.98: {
				slidesPerView: 3,
			},
		},

		navigation: {
			nextEl: '.calculator__button-next',
			prevEl: '.calculator__button-prev',
		},

	});
}

if (document.querySelector('.manufacturers__slider')) {
	new Swiper('.manufacturers__slider', {
		slidesPerView: 6,
		slidesPerGroup: 1,
		initialSlide: 0,
		spaceBetween: 10,

		simulateTouch: true,
		touthRadio: 1,
		touthAngle: 45,
		grabCursor: true,

		observer: true,
		observeParents: true,
		autoHeight: false,
		speed: 600,

		keyboard: {
			//включить выкльучит
			//возможность управления
			enabled: true,
			//включить выкльучит
			//стрелками
			//только когда слайдер
			//в пределах вьюпорта
			onlyInViewport: true,
			//включить выкльучит
			//управление клавишами
			//pageUP, pageDown
			pageUpDown: true,
		},

		navigation: {
			nextEl: '.manufacturers__button-next',
			prevEl: '.manufacturers__button-prev',
		},


		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			479.98: {
				slidesPerView: 2,
			},
			530: {
				slidesPerView: 3,
			},
			767.98: {
				slidesPerView: 4,
			},
			980: {
				slidesPerView: 5,
			},
			1095: {
				slidesPerView: 6,
			},
		},

	});
}

if (document.querySelector('.products__slider')) {
	new Swiper('.products__slider', {
		slidesPerView: 4,
		slidesPerGroup: 1,
		initialSlide: 0,
		spaceBetween: 24,

		simulateTouch: true,
		touthRadio: 1,
		touthAngle: 45,
		grabCursor: true,

		observer: true,
		observeParents: true,
		autoHeight: false,
		speed: 600,
		loop: true,


		pagination: {
			el: '.products__pagination',
			clickable: true,
		},

		navigation: {
			nextEl: '.products__button-next',
			prevEl: '.products__button-prev',
		},

		keyboard: {
			//включить выкльучит
			//возможность управления
			enabled: true,
			//включить выкльучит
			//стрелками
			//только когда слайдер
			//в пределах вьюпорта
			onlyInViewport: true,
			//включить выкльучит
			//управление клавишами
			//pageUP, pageDown
			pageUpDown: true,
		},

		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			515: {
				slidesPerView: 1,
			},
			515.98: {
				slidesPerView: 2,
			},
			730: {
				slidesPerView: 3,
			},
			1080: {
				slidesPerView: 4,
			},
		},

	});
}


if (document.querySelector('.videos__slider')) {
	new Swiper('.videos__slider', {
		slidesPerView: 3,
		slidesPerGroup: 1,
		initialSlide: 0,
		spaceBetween: 25,

		simulateTouch: false,
		touthRadio: 1,
		touthAngle: 45,
		grabCursor: true,

		observer: true,
		observeParents: true,
		autoHeight: false,
		speed: 600,
		loop: true,


		pagination: {
			el: '.videos__pagination',
			clickable: true,
		},

		navigation: {
			nextEl: '.videos__button-next',
			prevEl: '.videos__button-prev',
		},

		keyboard: {
			//включить выкльучит
			//возможность управления
			enabled: true,
			//включить выкльучит
			//стрелками
			//только когда слайдер
			//в пределах вьюпорта
			onlyInViewport: true,
			//включить выкльучит
			//управление клавишами
			//pageUP, pageDown
			pageUpDown: true,
		},

		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			767.98: {
				slidesPerView: 2,
			},
			991.98: {
				slidesPerView: 3,
			},
		},

	});
}

function email_test(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}
//let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
let forms = document.querySelectorAll('form');
if (forms.length > 0) {
	for (let index = 0; index < forms.length; index++) {
		const el = forms[index];
		el.addEventListener('submit', form_submit);
	}
}
async function form_submit(e) {
	let btn = e.target;
	let form = btn.closest('form');
	let error = form_validate(form);
	if (error == 0) {
		let formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
		let formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
		const message = form.getAttribute('data-message');
		const ajax = form.getAttribute('data-ajax');
		const test = form.getAttribute('data-test');

		//SendForm
		if (ajax) {
			e.preventDefault();
			let formData = new FormData(form);
			form.classList.add('_sending');
			let response = await fetch(formAction, {
				method: formMethod,
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				form.classList.remove('_sending');
				if (message) {
					popup_open(message + '-message');
				}
				form_clean(form);
			} else {
				alert("Ошибка");
				form.classList.remove('_sending');
			}
		}
		// If test
		if (test) {
			e.preventDefault();
			popup_open(message + '-message');
			form_clean(form);
		}
	} else {
		let form_error = form.querySelectorAll('._error');
		if (form_error && form.classList.contains('_goto-error')) {
			_goto(form_error[0], 1000, 50);
		}
		e.preventDefault();
	}
}
function form_validate(form) {
	let error = 0;
	let form_req = form.querySelectorAll('._req');
	if (form_req.length > 0) {
		for (let index = 0; index < form_req.length; index++) {
			const el = form_req[index];
			if (!_is_hidden(el)) {
				error += form_validate_input(el);
			}
		}
	}
	return error;
}
function form_validate_input(input) {
	let error = 0;
	let input_g_value = input.getAttribute('data-value');

	if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
		if (input.value != input_g_value) {
			let em = input.value.replace(" ", "");
			input.value = em;
		}
		if (email_test(input) || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	} else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
		form_add_error(input);
		error++;
	} else {
		if (input.value == '' || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	}
	return error;
}
function form_add_error(input) {
	input.classList.add('_error');
	input.parentElement.classList.add('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
	let input_error_text = input.getAttribute('data-error');
	if (input_error_text && input_error_text != '') {
		input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
	}
}
function form_remove_error(input) {
	input.classList.remove('_error');
	input.parentElement.classList.remove('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
}
function form_clean(form) {
	let inputs = form.querySelectorAll('input,textarea');
	for (let index = 0; index < inputs.length; index++) {
		const el = inputs[index];
		el.parentElement.classList.remove('_focus');
		el.classList.remove('_focus');
		el.value = el.getAttribute('data-value');
	}
	let checkboxes = form.querySelectorAll('.checkbox__input');
	if (checkboxes.length > 0) {
		for (let index = 0; index < checkboxes.length; index++) {
			const checkbox = checkboxes[index];
			checkbox.checked = false;
		}
	}
	let selects = form.querySelectorAll('select');
	if (selects.length > 0) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_default_value = select.getAttribute('data-default');
			select.value = select_default_value;
			select_item(select);
		}
	}
}

//Placeholers
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);
function inputs_init(inputs) {
	if (inputs.length > 0) {
		for (let index = 0; index < inputs.length; index++) {
			const input = inputs[index];
			const input_g_value = input.getAttribute('data-value');
			input_placeholder_add(input);
			if (input.value != '' && input.value != input_g_value) {
				input_focus_add(input);
			}
			input.addEventListener('focus', function (e) {
				if (input.value == input_g_value) {
					input_focus_add(input);
					input.value = '';
				}
				if (input.getAttribute('data-type') === "pass") {
					input.setAttribute('type', 'password');
				}
				if (input.classList.contains('_date')) {
					/*
					input.classList.add('_mask');
					Inputmask("99.99.9999", {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
					*/
				}
				if (input.classList.contains('_phone')) {
					//'+7(999) 999 9999'
					//'+38(999) 999 9999'
					//'+375(99)999-99-99'
					input.classList.add('_mask');
					Inputmask('8(999) 999 9999', {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				if (input.classList.contains('_digital')) {
					input.classList.add('_mask');
					Inputmask("9{1,}", {
						"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				form_remove_error(input);
			});
			input.addEventListener('blur', function (e) {
				if (input.value == '') {
					input.value = input_g_value;
					input_focus_remove(input);
					if (input.classList.contains('_mask')) {
						input_clear_mask(input, input_g_value);
					}
					if (input.getAttribute('data-type') === "pass") {
						input.setAttribute('type', 'text');
					}
				}
			});
			if (input.classList.contains('_date')) {
				const calendarItem = datepicker(input, {
					customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
					customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
					overlayButton: 'Применить',
					overlayPlaceholder: 'Год (4 цифры)',
					startDay: 1,
					formatter: (input, date, instance) => {
						const value = date.toLocaleDateString()
						input.value = value
					},
					onSelect: function (input, instance, date) {
						input_focus_add(input.el);
					}
				});
				const dataFrom = input.getAttribute('data-from');
				const dataTo = input.getAttribute('data-to');
				if (dataFrom) {
					calendarItem.setMin(new Date(dataFrom));
				}
				if (dataTo) {
					calendarItem.setMax(new Date(dataTo));
				}
			}
		}
	}
}
function input_placeholder_add(input) {
	const input_g_value = input.getAttribute('data-value');
	if (input.value == '' && input_g_value != '') {
		input.value = input_g_value;
	}
}
function input_focus_add(input) {
	input.classList.add('_focus');
	input.parentElement.classList.add('_focus');
}
function input_focus_remove(input) {
	input.classList.remove('_focus');
	input.parentElement.classList.remove('_focus');
}
function input_clear_mask(input, input_g_value) {
	input.inputmask.remove();
	input.value = input_g_value;
	input_focus_remove(input);
}


//QUANTITY
let quantityButtons = document.querySelectorAll('.quantity__button');
if (quantityButtons.length > 0) {
	for (let index = 0; index < quantityButtons.length; index++) {
		const quantityButton = quantityButtons[index];
		quantityButton.addEventListener("click", function (e) {
			let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
			if (quantityButton.classList.contains('quantity__button_plus')) {
				value++;
			} else {
				value = value - 1;
				if (value < 1) {
					value = 1
				}
			}
			quantityButton.closest('.quantity').querySelector('input').value = value;
		});
	}
}