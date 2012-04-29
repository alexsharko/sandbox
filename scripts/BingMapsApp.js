// BingMapsApp.js
(function(){
Type.registerNamespace('bma');bma.BingMapsApp$1=function(){}
bma.BingMapsApp$1.prototype={$0:null,$1:null,$2:null,$3:function(){var $0=document.getElementById('map');var $1={};var $2=this.$4($0.getAttribute('data-credentials'));this.$1=new Microsoft.Maps.Pushpin($2.center,$1);this.$2=new Microsoft.Maps.Infobox($2.center,this.$6('Ipswich'));this.$0=new Microsoft.Maps.Map($0,$2);this.$0.entities.push(this.$1);this.$0.entities.push(this.$2);Microsoft.Maps.Events.addHandler(this.$1,'click',ss.Delegate.create(this,this.$7));Microsoft.Maps.Events.addHandler(this.$0,'viewchange',ss.Delegate.create(this,this.$8));},$4:function($p0){var $0={};$0.credentials=$p0;$0.showCopyright=false;$0.showMapTypeSelector=false;$0.showLogo=false;$0.showScalebar=false;$0.showNavControl=false;$0.showDashboard=false;$0.center=new Microsoft.Maps.Location(52.05,1.17);$0.zoom=12;$0.mapTypeId=Microsoft.Maps.MapTypeId.aerial;return $0;},$5:function($p0){$p0=($p0!=null)?$p0:'default Val';var $0='';var $1=0;if(!String.isNullOrEmpty($0)){$1=1;}else{$1=2;}return $1;},$6:function($p0){var $0={};$0.title=$p0;$0.visible=false;$0.offset=new Microsoft.Maps.Point(0,20);$0.height=48;$0.width=80;$0.showCloseButton=false;return $0;},$7:function($p0){var $0={};$0.visible=true;this.$2.setOptions($0);},$8:function($p0){var $0={};$0.visible=false;this.$2.setOptions($0);}}
bma.mmLib=function(){}
bma.mmLib.hello=function(elementID,msg){}
bma.mmLib.getHotels=function(town){bma.mmLib.getPhotos(town);}
bma.mmLib.getHotelsByLatLng=function(lat,lng,radius){var $0=bma.mmLib.$0+'db.php?lat1=52.043&lng1=1.000&lat2=52.157&lng2=1.440';$.getJSON($0+'&callback=?',null,function($p1_0){
var $1_0=Type.safeCast($p1_0,Array);var $1_1='';var $enum1=ss.IEnumerator.getEnumerator($1_0);while($enum1.moveNext()){var $1_2=$enum1.current;$1_1+=String.format('{0} - {1}<br/>',$1_2.city,$1_2.hotel_ref);}$('#res').html($1_1);});}
bma.mmLib.parseHotels=function(data){var $0=Type.safeCast(data,Array);var $1='';var $enum1=ss.IEnumerator.getEnumerator($0);while($enum1.moveNext()){var $2=$enum1.current;$1+=String.format('{0} - {1}<br/>',$2.city,$2.hotel_ref);}$('#res').html($1);}
bma.mmLib.getPhotos=function(town){var $0='http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=be9b6f66bd7a1c0c0f1465a1b7e8a764&tags={0}&per_page={1}&sort=interestingness-desc&safe_search=1&content_type=1&in_gallery=true&extras=o_dims%2Curl_sq%2Curl_m&format=json&jsoncallback=?';var $1=String.format($0,town,10,bma.mmLib.$0+'db.php?cmd=location&town='+town);$.getJSON($1,null,function($p1_0){
var $1_0=$p1_0;var $1_1='';$1_1+='';var $enum1=ss.IEnumerator.getEnumerator($1_0.photos.photo);while($enum1.moveNext()){var $1_2=$enum1.current;$1_1+=String.format('<img src={1} title=\"{0}\" style=\'display:none\'>\n',$1_2.title,$1_2.url_m);}$('#res').html($1_1);bma.mmLib.slideshow('#res');});}
bma.mmLib.slideshow=function(target){$(target+'img:gt(0)').hide();window.setInterval(function(){
$(target+' :first-child').fadeOut().next('img').fadeIn().end().appendTo(target);},3000);}
bma.BingMapsApp$0=function(){}
bma.BingMapsApp$1.registerClass('bma.BingMapsApp$1');bma.mmLib.registerClass('bma.mmLib');bma.BingMapsApp$0.registerClass('bma.BingMapsApp$0');bma.mmLib.$0='http://localhost/fb/apis/roommap.eu/';(function(){})();
})();// This script was generated using Script# v0.7.0.0
