//! BingMapsApp.debug.js
//

(function() {

Type.registerNamespace('bma');

////////////////////////////////////////////////////////////////////////////////
// bma._bingMapsShell

bma._bingMapsShell = function bma__bingMapsShell() {
    /// <field name="_map" type="Microsoft.Maps.Map">
    /// </field>
    /// <field name="_pushpin" type="Microsoft.Maps.Pushpin">
    /// </field>
    /// <field name="_infobox" type="Microsoft.Maps.Infobox">
    /// </field>
}
bma._bingMapsShell.prototype = {
    _map: null,
    _pushpin: null,
    _infobox: null,
    
    run: function bma__bingMapsShell$run() {
        var rootElement = document.getElementById('map');
        var pushpinOptions = {};
        var mapOptions = this._initMap(rootElement.getAttribute('data-credentials'));
        this._pushpin = new Microsoft.Maps.Pushpin(mapOptions.center, pushpinOptions);
        this._infobox = new Microsoft.Maps.Infobox(mapOptions.center, this._createInfoBox('Ipswich'));
        this._map = new Microsoft.Maps.Map(rootElement, mapOptions);
        this._map.entities.push(this._pushpin);
        this._map.entities.push(this._infobox);
        Microsoft.Maps.Events.addHandler(this._pushpin, 'click', ss.Delegate.create(this, this._onPushpinClick));
        Microsoft.Maps.Events.addHandler(this._map, 'viewchange', ss.Delegate.create(this, this._onViewChanged));
    },
    
    _initMap: function bma__bingMapsShell$_initMap(credentials) {
        /// <param name="credentials" type="String">
        /// </param>
        /// <returns type="Object"></returns>
        var mapOptions = {};
        mapOptions.credentials = credentials;
        mapOptions.showCopyright = false;
        mapOptions.showMapTypeSelector = false;
        mapOptions.showLogo = false;
        mapOptions.showScalebar = false;
        mapOptions.showNavControl = false;
        mapOptions.showDashboard = false;
        mapOptions.center = new Microsoft.Maps.Location(52.05, 1.17);
        mapOptions.zoom = 12;
        mapOptions.mapTypeId = Microsoft.Maps.MapTypeId.aerial;
        return mapOptions;
    },
    
    codingTests: function bma__bingMapsShell$codingTests(val) {
        /// <param name="val" type="String">
        /// </param>
        /// <returns type="Number" integer="true"></returns>
        val = (val != null) ? val : 'default Val';
        var test = '';
        var i = 0;
        if (!String.isNullOrEmpty(test)) {
            i = 1;
        }
        else {
            i = 2;
        }
        return i;
    },
    
    _createInfoBox: function bma__bingMapsShell$_createInfoBox(title) {
        /// <param name="title" type="String">
        /// </param>
        /// <returns type="Object"></returns>
        var infoboxOptions = {};
        infoboxOptions.title = title;
        infoboxOptions.visible = false;
        infoboxOptions.offset = new Microsoft.Maps.Point(0, 20);
        infoboxOptions.height = 48;
        infoboxOptions.width = 80;
        infoboxOptions.showCloseButton = false;
        return infoboxOptions;
    },
    
    _onPushpinClick: function bma__bingMapsShell$_onPushpinClick(e) {
        /// <param name="e" type="ss.EventArgs">
        /// </param>
        var options = {};
        options.visible = true;
        this._infobox.setOptions(options);
    },
    
    _onViewChanged: function bma__bingMapsShell$_onViewChanged(e) {
        /// <param name="e" type="ss.EventArgs">
        /// </param>
        var options = {};
        options.visible = false;
        this._infobox.setOptions(options);
    }
}


////////////////////////////////////////////////////////////////////////////////
// bma.mmLib

bma.mmLib = function bma_mmLib() {
    /// <field name="_base_uri" type="String" static="true">
    /// </field>
}
bma.mmLib.hello = function bma_mmLib$hello(elementID, msg) {
    /// <param name="elementID" type="String">
    /// </param>
    /// <param name="msg" type="String">
    /// </param>
}
bma.mmLib.getHotels = function bma_mmLib$getHotels(town) {
    /// <param name="town" type="String">
    /// </param>
    bma.mmLib.getPhotos(town);
}
bma.mmLib.getHotelsByLatLng = function bma_mmLib$getHotelsByLatLng(lat, lng, radius) {
    /// <param name="lat" type="Number">
    /// </param>
    /// <param name="lng" type="Number">
    /// </param>
    /// <param name="radius" type="Number">
    /// </param>
    var q = bma.mmLib._base_uri + 'db.php?lat1=52.043&lng1=1.000&lat2=52.157&lng2=1.440';
    $.getJSON(q + '&callback=?', null, function(data) {
        var hotels = Type.safeCast(data, Array);
        var res = '';
        var $enum1 = ss.IEnumerator.getEnumerator(hotels);
        while ($enum1.moveNext()) {
            var hotel = $enum1.current;
            res += String.format('{0} - {1}<br/>', hotel.city, hotel.hotel_ref);
        }
        $('#res').html(res);
    });
}
bma.mmLib.parseHotels = function bma_mmLib$parseHotels(data) {
    /// <param name="data" type="Object">
    /// </param>
    var hotels = Type.safeCast(data, Array);
    var res = '';
    var $enum1 = ss.IEnumerator.getEnumerator(hotels);
    while ($enum1.moveNext()) {
        var hotel = $enum1.current;
        res += String.format('{0} - {1}<br/>', hotel.city, hotel.hotel_ref);
    }
    $('#res').html(res);
}
bma.mmLib.getPhotos = function bma_mmLib$getPhotos(town) {
    /// <param name="town" type="String">
    /// </param>
    var FlickrSearchURLFormat = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=be9b6f66bd7a1c0c0f1465a1b7e8a764&tags={0}&per_page={1}&sort=interestingness-desc&safe_search=1&content_type=1&in_gallery=true&extras=o_dims%2Curl_sq%2Curl_m&format=json&jsoncallback=?';
    var q = String.format(FlickrSearchURLFormat, town, 10, bma.mmLib._base_uri + 'db.php?cmd=location&town=' + town);
    $.getJSON(q, null, function(data) {
        var response = data;
        var res = '';
        res += '';
        var $enum1 = ss.IEnumerator.getEnumerator(response.photos.photo);
        while ($enum1.moveNext()) {
            var photo = $enum1.current;
            res += String.format('<img src={1} title=\"{0}\" style=\'display:none\'>\n', photo.title, photo.url_m);
        }
        $('#res').html(res);
        bma.mmLib.slideshow('#res');
    });
}
bma.mmLib.slideshow = function bma_mmLib$slideshow(target) {
    /// <param name="target" type="String">
    /// </param>
    $(target + 'img:gt(0)').hide();
    window.setInterval(function() {
        $(target + ' :first-child').fadeOut().next('img').fadeIn().end().appendTo(target);
    }, 3000);
}


////////////////////////////////////////////////////////////////////////////////
// bma._bingMapsApplication

bma._bingMapsApplication = function bma__bingMapsApplication() {
}


bma._bingMapsShell.registerClass('bma._bingMapsShell');
bma.mmLib.registerClass('bma.mmLib');
bma._bingMapsApplication.registerClass('bma._bingMapsApplication');
bma.mmLib._base_uri = 'http://localhost/fb/apis/roommap.eu/';
(function () {
})();
})();

//! This script was generated using Script# v0.7.0.0
