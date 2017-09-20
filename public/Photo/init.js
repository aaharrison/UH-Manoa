password = sessionStorage.getItem("key")

// if (password != "mkoffice" || password != "manoa") {
//   window.open(window.open("../index.html", "_self" ))
// }

if (password == "mkoffice") {
  console.log("Previous User Log In")
} else if (password == "manoa") {
    console.log("Previous J Kurata Log In")
} else {
    window.open(window.open("index.html", "_self" ))
}

username = "holder"
password = "holder"


// Client ID and API key from the Developer Console
var CLIENT_ID = '242641968476-jmeo6n7kkt71rmlg55e0hb4c2d569gg6.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive';

/* spinner */
opts = {lines: 9, length: 9, width: 5, radius: 14, color: "#525252", speed: 1.9, trail: 40, className: "spinner"};
var target = document.getElementById("spin-area");
spinner = new Spinner(opts).spin(target);

var authorizeModal = document.getElementById('authorize-modal');
var authorizeButton = document.getElementById('authorize-button');

/* on load, called to load the auth2 library and API client library */

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/* initializes the API client library and sets up sign-in state listeners */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
  });
}

/* called when the signed in status changes, to update the UI appropriately. after a sign-in, the API is called */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeModal.style.display = 'none';
    authorizeButton.style.display = 'none';
    loadContent();
  } else {
    authorizeModal.style.display = 'block';
    authorizeButton.style.display = 'block';
  }
}

/* sign in the user upon button click */

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/*load page content*/

function loadContent () {
  d3.queue()
    .defer(d3.csv, "bldgs.csv")
    .await(loadBldgs);

  d3.queue()
    .defer(d3.csv, "rooms.csv")
    .await(loadRooms);

  function loadBldgs(error, _bldgdata) {
    if(error) {
      console.log(error);
     }

    bldgdata = _bldgdata;
    listBldgs();
  }

  function loadRooms(error, _roomdata) {
    if(error) {
      console.log(error);
     }
    _roomdata.forEach (function(r) {
      r.link = r.link;
    });
    roomdata = _roomdata;
    // console.log(roomdata);
  }

  setTimeout(function () {spinner.stop(); document.getElementById('content-area').style.display = "block";},1500);
}

//building selection controls

function listBldgs() {
  //api call for folder names + ids
  gapi.client.drive.files.list({
    'orderBy': "folder, name",
    'q': "(\'0ByZIs606S7oWcVdxN0M4WWo0alE\' in parents)",
    'fields': "nextPageToken, files(id, name)",
    'pageSize': 500,
  }).then(function(response) {
    files = response.result.files;
    bList = [];
    bListHtml = '';
    //construct array of folder names + ids
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var string = '';
      var string = file.name +', ' +file.id;
      var array = [];
      var array = string.split(",");
      bList.push(array);
    }
  }).then(function() {
    //merge folder ids with complete csv list of bldgs using 'name' as the match reference 
    for (var i = 0; i < bldgdata.length; i++) {
      var bName = bldgdata[i].bldg;
      var result = $.grep(bList, function(e) {return e[0] === bName;});
      //construct html-ified list of building selection options.
      if (result.length === 0) {
        bListHtml = bListHtml + '<option value=\"no folder, ' + bName + '\" style=\"font-style:italic\"' + '>' + bName + '</option>';
      } else if (result.length == 1) {
        bListHtml = bListHtml + '<option value=\"' + (result[0])[1] + ',' + (result[0])[0] + '\">' + (result[0])[0] + '</option>';
        document.getElementById('bSelect').innerHTML = bListHtml;
      }
    }
  });
}

function filterBldgs() {
  var $options = $('#bSelect option');
  document.getElementById('bSearch').onkeyup = function () {
    var $HiddenOptions = $('#bSelectHidden option');
    $HiddenOptions.each(function (index, value) {
    document.getElementById('bSelect').appendChild(this);
    });
  var search = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
  var element = $options.filter(function () {
  var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
  return !~text.indexOf(search);
  }).appendTo(document.getElementById('bSelectHidden'));
  $('#bSelect option').sort(bSort).appendTo('#bSelect');
  if (document.getElementById('bSelect').length <= 2) {
    document.getElementById('bSelect').size = 2;
  } else if (document.getElementById('bSelect').length <= 5) {
    document.getElementById('bSelect').size = document.getElementById('bSelect').length;
  } else {
    document.getElementById('bSelect').size = 5;
  }
}}

function bSort(a, b) {
return (a.innerHTML > b.innerHTML) ? 1 : -1;
}

function toggleBldgButton(value) {
  if (document.getElementById('bButton').style.display === 'block') {
    //reveal building selection elements
    document.getElementById('bButton').style.display = 'none';
    document.getElementById('bForm').style.display = 'block';
    document.getElementById('bSelect').style.display = 'block';
    document.getElementById('bSearch').style.display = 'block';
    document.getElementById('bSearch').focus();
    document.getElementById('bResetIcon').style.display = 'none';
    //hide room selection elements
    document.getElementById('rButton').style.display = 'none';
    document.getElementById('rSelect').style.display = 'none';
    document.getElementById('rSearch').style.display = 'none';
  } else {
    //hide building selection elements
    document.getElementById('bButton').style.display = 'block';
    
    var array = [];
    var array = value.split(",");
    var bId = array[0].trim();
    var bName = array[1].trim();
    document.getElementById('bButton').innerHTML = '<div style=\"white-space:nowrap; width:275px; overflow:hidden; text-overflow:ellipsis;\">' + bName + '</div>';
    document.getElementById('bForm').style.display = 'none';
    document.getElementById('bSelect').style.display = 'none';
    document.getElementById('bSearch').style.display = 'none';
    document.getElementById('bResetIcon').style.display = 'block';
    //hide room info
    document.getElementById('room-info').style.display = 'none';
    //show room selection elements
    document.getElementById('rButton').innerHTML = 'SELECT ROOM';
    document.getElementById('rButton').style.display = 'block';
    document.getElementById('rSelect').style.display = 'block';
    listRooms(bId,bName);
  }
}

function resetBldgButton() {
  //reset building selectors
  document.getElementById('bButton').innerHTML = 'SELECT BUILDING';
  document.getElementById('bButton').style.display = 'block';
  document.getElementById('bForm').style.display = 'none';
  document.getElementById('bSelect').style.display = 'none';
  document.getElementById('bSearch').innerHTML = '';
  document.getElementById('bSearch').style.display = 'none';
  document.getElementById('bResetIcon').style.display = 'none';
  //hide + reset room selectors
  document.getElementById('rButton').style.display = 'none';
  document.getElementById('rForm').style.display = 'none';
  //reset photos
  document.getElementById('thumbnail-liner').innerHTML = '';
  document.getElementById('photo-frame').innerHTML = '';
  //reset room info
  document.getElementById('room-info').style.display = 'none';
  //reset nophoto-modal
  document.getElementById('nophoto-modal').style.display = 'none';
}

//room selection controls

function listRooms(bId,bName) {
  rList = [];
  rListHtml = '';
  if (bId == 'no folder') {
    var data = (roomdata.filter(function(d) {return (d.bldg == bName)}));
    for (var i = 0; i < data.length; i++) {
      var rName = (data[i].room).replace('\'','');
      rListHtml = rListHtml + '<option value=\"' + 'no folder' + ',' + rName + ',' + 'no folder' + ',' + bName +'\">' + rName + '</option>';
      document.getElementById('rSelect').innerHTML = rListHtml;
    }
  } else {
    //api call for folder names + ids
    gapi.client.drive.files.list({
      'orderBy': "folder, name",
      'q': "(\'" + bId + "\' in parents)",
      'fields': "nextPageToken, files(id, name)",
      'pageSize': 500,
    }).then(function(response) {
      var files = response.result.files;
      //construct array of folder names + ids
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var string = '';
        var string = file.name +', ' +file.id;
        var array = [];
        var array = string.split(",");
        rList.push(array);
      }
    }).then(function() {
      var data = (roomdata.filter(function(d) {return (d.bldg == bName)}));
      //merge folder ids with complete csv list of bldgs using 'name' as the match reference 
      for (var i = 0; i < data.length; i++) {
        var rName = (data[i].room).replace('\'','');
        var result = $.grep(rList, function(e) {return e[0] === rName;});
        //construct html-ified list of building selection options.
        if (result.length == 1) {
          rListHtml = rListHtml + '<option value=\"' + (result[0])[1] + ',' + (result[0])[0] + ',' + bId + ',' + bName +'\">' + (result[0])[0] + '</option>';
          document.getElementById('rSelect').innerHTML = rListHtml;
        } else {
          rListHtml = rListHtml + '<option style=\"color:#d3d3d3\" value=\"' + 'no folder' + ',' + rName + ',' + 'no folder' + ',' + bName +'\">' + rName + '</option>';
          document.getElementById('rSelect').innerHTML = rListHtml;
        }
      }
    }).then (function() {
      var tmpAry = new Array();
      for (var i=0;i<rSelect.options.length;i++) {
          tmpAry[i] = new Array();
          tmpAry[i][0] = rSelect.options[i].text;
          tmpAry[i][1] = rSelect.options[i].value;
      }
      tmpAry.sort();
      while (rSelect.options.length > 0) {
          rSelect.options[0] = null;
      }
      for (var i=0;i<tmpAry.length;i++) {
          var op = new Option(tmpAry[i][0], tmpAry[i][1]);
          rSelect.options[i] = op;
      }
      return;
    });
  }
}

function toggleRoomButton(value) {
  if (document.getElementById('rButton').style.display === 'block') {
    //reveal room selection elements
    document.getElementById('rButton').style.display = 'inline-block';
    document.getElementById('rForm').style.display = 'block';
    document.getElementById('rSelect').style.display = 'block';
//    document.getElementById('rSearch').style.display = 'block';
//    document.getElementById('rSearch').focus();
  } else {
    //hide room selection elements
    document.getElementById('rButton').style.display = 'block';
    var array = [];
    var array = value.split(",");
    var rName = array[1];
    document.getElementById('rButton').innerHTML = '<div style=\"white-space:nowrap; width:275px; overflow:hidden; text-overflow:ellipsis;\">' + rName + '</div>';
    document.getElementById('rForm').style.display = 'none';
    document.getElementById('rSelect').style.display = 'none';
    document.getElementById('rSearch').style.display = 'none';
  }
}

function rSort(a, b) {
return (a.innerHTML > b.innerHTML) ? 1 : -1;
}

function pullRoomData(value) {
  var array = [];
  var array = value.split(",");
  var rId = array[0];
  var rName = array[1];
  var bId = array[2];
  var bName = array[3];
  document.getElementById('room-info').style.display = 'block';
  data = (roomdata.filter(function(d) {return (d.link == bName + '-' + rName)}));
  document.getElementById('flr_lvlr').innerHTML = data[0].room_floor;
  document.getElementById('rm_sqftr').innerHTML = data[0].room_sf;
  document.getElementById('rm_icapr').innerHTML = data[0].room_icap;
  document.getElementById('nces_catr').innerHTML = '(' + data[0].nces_c_code + ') - ' + data[0].nces_c_descr;
  document.getElementById('nces_detr').innerHTML = '(' + data[0].nces_d_code + ') - ' + data[0].nces_d_descr;
  document.getElementById('org1r').innerHTML = data[0].org_descr1;
  if (document.getElementById('org1r').offsetHeight > 19) {document.getElementById('org1h').style.minHeight = 22 + 'px'} else {document.getElementById('org1h').style.minHeight = 12 + 'px'};
  document.getElementById('org2r').innerHTML = data[0].org_descr2;
  if (document.getElementById('org2r').offsetHeight > 19) {document.getElementById('org2h').style.minHeight = 22 + 'px'} else {document.getElementById('org2h').style.minHeight = 12 + 'px'};
  document.getElementById('org3r').innerHTML = data[0].org_descr3;
  if (document.getElementById('org3r').offsetHeight > 19) {document.getElementById('org3h').style.minHeight = 22 + 'px'} else {document.getElementById('org3h').style.minHeight = 12 + 'px'};
  document.getElementById('org4r').innerHTML = data[0].org_descr4;
  if (document.getElementById('org4r').offsetHeight > 19) {document.getElementById('org4h').style.minHeight = 22 + 'px'} else {document.getElementById('org4h').style.minHeight = 12 + 'px'};
  document.getElementById('org5r').innerHTML = data[0].org_descr5;
  if (document.getElementById('org5r').offsetHeight > 19) {document.getElementById('org5h').style.minHeight = 22 + 'px'} else {document.getElementById('org5h').style.minHeight = 12 + 'px'};
  document.getElementById('org6r').innerHTML = data[0].org_descr6;
  if (document.getElementById('org6r').offsetHeight > 19) {document.getElementById('org6h').style.minHeight = 22 + 'px'} else {document.getElementById('org6h').style.minHeight = 12 + 'px'};
  document.getElementById('org7r').innerHTML = data[0].org_descr7;
  if (document.getElementById('org7r').offsetHeight > 19) {document.getElementById('org7h').style.minHeight = 22 + 'px'} else {document.getElementById('org7h').style.minHeight = 12 + 'px'};
  document.getElementById('org8r').innerHTML = data[0].org_descr8;
  if (document.getElementById('org8r').offsetHeight > 19) {document.getElementById('org8h').style.minHeight = 22 + 'px'} else {document.getElementById('org8h').style.minHeight = 12 + 'px'};
  document.getElementById('accessr').innerHTML = data[0].access_descr;
  if (document.getElementById('accessr').offsetHeight > 19) {document.getElementById('accessh').style.minHeight = 22 + 'px'} else {document.getElementById('accessh').style.minHeight = 12 + 'px'};
  document.getElementById('nat_ventr').innerHTML = data[0].vent_nat;
  if (document.getElementById('nat_ventr').offsetHeight > 19) {document.getElementById('nat_venth').style.minHeight = 22 + 'px'} else {document.getElementById('nat_venth').style.minHeight = 12 + 'px'};
  document.getElementById('art_ventr').innerHTML = data[0].vent_art;
  if (document.getElementById('art_ventr').offsetHeight > 19) {document.getElementById('art_venth').style.minHeight = 22 + 'px'} else {document.getElementById('art_venth').style.minHeight = 12 + 'px'};
  document.getElementById('ac_sysr').innerHTML = data[0].ac_types;
  if (document.getElementById('ac_sysr').offsetHeight > 19) {document.getElementById('ac_sysh').style.minHeight = 22 + 'px'} else {document.getElementById('ac_sysh').style.minHeight = 12 + 'px'};
  document.getElementById('fansr').innerHTML = data[0].fan_types;
  if (document.getElementById('fansr').offsetHeight > 19) {document.getElementById('fansh').style.minHeight = 22 + 'px'} else {document.getElementById('fansh').style.minHeight = 12 + 'px'};
  document.getElementById('fenesr').innerHTML = data[0].fenes;
  if (document.getElementById('fenesr').offsetHeight > 19) {document.getElementById('fenesh').style.minHeight = 22 + 'px'} else {document.getElementById('fenesh').style.minHeight = 12 + 'px'};
  document.getElementById('nat_lightr').innerHTML = data[0].nat_lighting;
  if (document.getElementById('nat_lightr').offsetHeight > 19) {document.getElementById('nat_lighth').style.minHeight = 22 + 'px'} else {document.getElementById('nat_lighth').style.minHeight = 12 + 'px'};
  document.getElementById('art_lightr').innerHTML = data[0].art_lighting;
  if (document.getElementById('art_lightr').offsetHeight > 19) {document.getElementById('art_lighth').style.minHeight = 22 + 'px'} else {document.getElementById('art_lighth').style.minHeight = 12 + 'px'};
  document.getElementById('light_contr').innerHTML = data[0].art_light_cont;
  if (document.getElementById('light_contr').offsetHeight > 19) {document.getElementById('light_conth').style.minHeight = 22 + 'px'} else {document.getElementById('light_conth').style.minHeight = 12 + 'px'};
  document.getElementById('acous_qualr').innerHTML = data[0].noise_lvl;
  if (document.getElementById('acous_qualr').offsetHeight > 19) {document.getElementById('acous_qualh').style.minHeight = 22 + 'px'} else {document.getElementById('acous_qualh').style.minHeight = 12 + 'px'};
  document.getElementById('acous_impr').innerHTML = data[0].acous_cont;
  if (document.getElementById('acous_impr').offsetHeight > 19) {document.getElementById('acous_imph').style.minHeight = 22 + 'px'} else {document.getElementById('acous_imph').style.minHeight = 12 + 'px'};
  document.getElementById('num_seatsr').innerHTML = data[0].seat_num;
  if (document.getElementById('num_seatsr').offsetHeight > 19) {document.getElementById('num_seatsh').style.minHeight = 22 + 'px'} else {document.getElementById('num_seatsh').style.minHeight = 12 + 'px'};
  document.getElementById('seat_flexr').innerHTML = data[0].seat_flex;
  if (document.getElementById('seat_flexr').offsetHeight > 19) {document.getElementById('seat_flexh').style.minHeight = 22 + 'px'} else {document.getElementById('seat_flexh').style.minHeight = 12 + 'px'};
  document.getElementById('room_featr').innerHTML = data[0].room_feats;
  if (document.getElementById('room_featr').offsetHeight > 19) {document.getElementById('room_feath').style.minHeight = 22 + 'px'} else {document.getElementById('room_feath').style.minHeight = 12 + 'px'};
  document.getElementById('pct_storr').innerHTML = data[0].pct_stor;
  if (document.getElementById('pct_storr').offsetHeight > 19) {document.getElementById('pct_storh').style.minHeight = 22 + 'px'} else {document.getElementById('pct_storh').style.minHeight = 12 + 'px'};
  document.getElementById('pct_niur').innerHTML = data[0].pct_unused;
  if (document.getElementById('pct_niur').offsetHeight > 19) {document.getElementById('pct_niuh').style.minHeight = 22 + 'px'} else {document.getElementById('pct_niuh').style.minHeight = 12 + 'px'};
}

//LIST ROOMS

function listRoomPhotos(value) {
  document.getElementById('photo-frame').innerHTML = '';
  document.getElementById('thumbnail-liner').innerHTML = '';
  var array = [];
  var array = value.split(",");
  var rId = (array[0]).trim();
  var rName = (array[1]).trim();
  thumbnails = [];
  totalW = 0;
  if (rId == 'no folder') { 
    document.getElementById('nophoto-modal').style.display = 'block';
  } else {
    document.getElementById('nophoto-modal').style.display = 'none';
    gapi.client.drive.files.list({
    'orderBy': "folder, name",
    'q': "(\'" + rId + "\' in parents)",
    'fields': "nextPageToken, files(id, name, thumbnailLink, imageMediaMetadata)",
    'pageSize': 1000,
  }).then(function(response) {
    var photos = response.result.files;
    for (var i = 0; i < photos.length; i++) {
      var photo = photos[i];
      var w;
      if (photo.imageMediaMetadata.rotation == 0 || photo.imageMediaMetadata.rotation == 2) {
        w = (photo.imageMediaMetadata.width*90)/photo.imageMediaMetadata.height;
      } else {
        w = (photo.imageMediaMetadata.height*90)/photo.imageMediaMetadata.width;
      }
      totalW = totalW + w + 10.5;
      thumbnails[i] = '<div class =\"thumbnail-holder\" id=\"' + photo.id + '\"name=\"' + rId + '\" style =\"width:' + w + 'px; display:inline-block;\"><img class=\"thumbnail\" src=\"' + photo.thumbnailLink + '\" name=\"' + photo.id + '\"></img></div>';
    }
  }).then(function() {
    document.getElementById('thumbnail-liner').innerHTML = thumbnails;
    document.getElementById('thumbnail-liner').style.width = totalW + 'px';
  }).then(function() {
      var photos = document.getElementsByClassName("thumbnail");
      var selectListener = function () {
         var activeIframe = '<iframe src=\"https://drive.google.com/file/d/' + this.name + '/preview\" id=\"photo-full\"></iframe>';
          document.getElementById('photo-frame').innerHTML = activeIframe;
        };
        for (var i = 0; i < photos.length; i++) {
          photos[i].addEventListener('click', selectListener, false);
        }
        document.getElementById('photo-frame').innerHTML = '<iframe src=\"https://drive.google.com/file/d/' + photos[0].name + '/preview\" id=\"photo-full\"></iframe>';
      });
  }
}



function openTableau(){
  window.open("../tableau2.html", "_self")
}

function openFlux(){
    window.open("../FluxApp/index.html", "_self")
}

function logout(){
  window.open("../index.html", "_self")
  username = "holder"
  password = "holder"
}

function openHome() {
    window.open("../home.html", "_self")
}

function openRH1() {
    window.open("http://www.roundhouseone.com/", "_self")
}


