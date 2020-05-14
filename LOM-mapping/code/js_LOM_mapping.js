//include("mylib.js");
autowatch = 1;
var LOM_songview_selectedParameter = null;

var mapOn = 0;
var thisDeviceId = 0;

function get_this_device_id() {
    var LOM_this_device = new LiveAPI("this_device");
    thisDeviceId = LOM_this_device.id;
}

function map(val) {
    get_this_device_id();
    if(val == 1) {
        LOM_songview_selectedParameter = new LiveAPI(cb_selectedParameter, "live_set view")
        LOM_songview_selectedParameter.property = "selected_parameter";
    }
    mapOn = val; // avoiding first click getting paramID
}

function cb_selectedParameter(args) {
    if(args[0] == "selected_parameter" && mapOn == 1) {

        // cancel when id 0
        if(args[2] == 0) {
            return;
        }

        outlet(0, "selected_parameter_id", args[2]);
    }
}

function selected_parameter_id(id) {
    var LOM_deviceParameter = new LiveAPI("id " + id);
    var LOM_deviceParameter_parent = new LiveAPI(dequote(LOM_deviceParameter.path) + " canonical_parent");
    var parameterDeviceId = LOM_deviceParameter_parent.id;

    // same device mapping cancel
    if(parameterDeviceId == thisDeviceId) {
        // except my M4L mappng system releated param
        var parameterName = LOM_deviceParameter.get("name");
        if(!isNaN(String(parameterName).split(" ")[0])) {
            //("same and canceled");
            return;
        }
    }

    outlet(0, "target_parameter_id", id);

    // no more callback
    delete LOM_songview_selectedParameter.cb_private;
}


function get_mappingRangeAndName(id) {

    if(id == 0) {
        outlet(0, "target_parameter_min", 0);
        outlet(0, "target_parameter_max", 1);
        outlet(0, "target_parameter_name", "map")
        return;
    }

    var LOM_deviceParameter = new LiveAPI("id " + id);
    outlet(0, "target_parameter_min", LOM_deviceParameter.get("min"));
    outlet(0, "target_parameter_max", LOM_deviceParameter.get("max"));
    outlet(0, "target_parameter_name", LOM_deviceParameter.get("name"));
}


function dequote(string) {
    return string.replace(/\"/g, "");
}
