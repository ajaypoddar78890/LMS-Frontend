(function () {
  // Define the SCORM namespace if not already defined
  window.pipwerks = window.pipwerks || {};
  window.pipwerks.SCORM = window.pipwerks.SCORM || {};

  // SCORM 1.2 and 2004 API implementation
  var scorm = window.pipwerks.SCORM;

  // SCORM API initialization
  scorm.version = "1.2"; // Set to '2004' if using SCORM 2004

  scorm.init = function () {
    try {
      // Find SCORM API
      var api = findAPI(window);
      if (api) {
        scorm.api = api;
        return true;
      } else {
        console.error("SCORM API not found.");
        return false;
      }
    } catch (e) {
      console.error("Error initializing SCORM:", e);
      return false;
    }
  };

  scorm.get = function (name) {
    try {
      if (scorm.api) {
        var value = scorm.api.GetValue(name);
        console.log("SCORM GET", name, ":", value);
        return value;
      } else {
        console.error("SCORM API not initialized.");
        return "";
      }
    } catch (e) {
      console.error("Error getting SCORM value:", e);
      return "";
    }
  };

  scorm.set = function (name, value) {
    try {
      if (scorm.api) {
        var success = scorm.api.SetValue(name, value);
        if (success) {
          console.log("SCORM SET", name, ":", value);
        } else {
          console.error("Error setting SCORM value.");
        }
        return success;
      } else {
        console.error("SCORM API not initialized.");
        return false;
      }
    } catch (e) {
      console.error("Error setting SCORM value:", e);
      return false;
    }
  };

  scorm.save = function () {
    try {
      if (scorm.api) {
        var success = scorm.api.Commit("");
        if (success) {
          console.log("SCORM data saved.");
        } else {
          console.error("Error saving SCORM data.");
        }
        return success;
      } else {
        console.error("SCORM API not initialized.");
        return false;
      }
    } catch (e) {
      console.error("Error saving SCORM data:", e);
      return false;
    }
  };

  scorm.quit = function () {
    try {
      if (scorm.api) {
        var success = scorm.api.Terminate("");
        if (success) {
          console.log("SCORM session terminated.");
        } else {
          console.error("Error terminating SCORM session.");
        }
        return success;
      } else {
        console.error("SCORM API not initialized.");
        return false;
      }
    } catch (e) {
      console.error("Error terminating SCORM session:", e);
      return false;
    }
  };

  // Function to find the SCORM API
  function findAPI(win) {
    if (win.API) return win.API;
    if (win.API_1484_11) return win.API_1484_11;
    if (win.parent) return findAPI(win.parent);
    if (win.opener) return findAPI(win.opener);
    return null;
  }
})();
