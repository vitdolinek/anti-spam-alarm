// ==UserScript==
// @name         Grepolis Anti-Spam Script
// @namespace    https://grepodata.com/
// @version      1.11
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTKIH5FdU3ZTYb4Dpe537qSKl1fAgdo6bPtPjr8FJYHWPD0ykkg
// @icon64       https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTKIH5FdU3ZTYb4Dpe537qSKl1fAgdo6bPtPjr8FJYHWPD0ykkg
// @include     /http[s]{0,1}://[a-z]{2}[0-9]{1,}\.grepolis\.com/*
// @description  Script that will turn alarm on only for people you want to!
// @author       Vít Dolínek
// @copyright    2023, LG (https://openuserjs.org/users/shigatora)
// @licence      MIT
// @match        https://www.tampermonkey.net/
// @require      https://raw.githubusercontent.com/kamranahmedse/jquery-toast-plugin/master/dist/jquery.toast.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/iconify/2.0.0/iconify.without-api.min.js


// ==/UserScript==
const w = unsafeWindow || window;

w.LGAntiSpam = {
  alarm: {
    soundPlaying: false,
    alarmNode: null,
    alarmListener: function (val) {},
    activateSound: function () {
      this.soundPlaying = true;
      this.alarmListener(true);
    },
    deactivateSound: function () {
      this.soundPlaying = false;
      this.alarmListener(false);
    },
    get sound() {
      return this.soundPlaying;
    },
    set node(val) {
      this.alarmNode = val;
    },
    get node() {
      return this.alarmNode;
    },
    registerListener: function (listener) {
      this.alarmListener = listener;
    },
  },
};

let alarmAudio = $("<audio />", {
  preload: "auto",
  id: "spam_alarm",
  autoplay: false,
  loop: true,
  volume: parseInt(localStorage.getItem("antiSpamAlarmVolume")) || 0 / 100,
});
let alarmSource = $("<source />", {
  src: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-84577/zapsplat_emergency_siren_beep_warning_nuclear_meltdown_84854.mp3",
});
alarmAudio.append(alarmSource);
LGAntiSpam.alarm.node = alarmAudio[0];

/**
 * Injects stylesheet to document head.
 *
 * @param {string} url
 */
function injectStylesheet(url) {
  $("head").append(url);
}

function buildGuideTab() {
  let wrapper = $("<div/>", {
    style:
      "display:flex;justify-content: center;padding: 0 25px 25px 25px;flex-direction: column;align-items: center;",
  });

  wrapper.append(
    $(
      `
      <div style="display: flex;flex-direction:row;justify-content:center;align-items:center;margin:15px;">
      <span class="iconify" data-icon="mi:circle-help" data-height="3em" style="margin-right: 10px;" data-inline="false"></span>
        <h2>Guide</h2>
      </div>
      <h3>Mobile alarm</h3>
      <p>For mobile alarm you will need Catapush Messenger application. The application is available for both <a href="https://apps.apple.com/gb/app/catapush-messenger/id993475148" target="_blank">iOS</a> and <a href="https://play.google.com/store/apps/details?id=com.catapush.app.demo" target="_blank">Android</a>.
      Once you download and run the application, you will need to complete a few steps to set up your account. With your account set up, the only thing you will need is your number - it reflects your phone number with country code, but without + or 00. The format is {country code}{phone number}, eg. UK phone 44123456789.
      </p>
      `
    )
  );

  return wrapper;
}

/** TODO: No longer exists, rewrite the function so it uses local storage */
// async function buildLogTab() {
//   const logs = await fetch(
//     `https://dolinek.dev/alarm/attack/${Game.world_id}/${Game.player_id}/log`
//   )
//     .then((response) => response.json())
//     .catch(() => []);

//   let wrapper = $("<div/>", {
//     style: "display:block;",
//   });

//   wrapper.append(
//     $(
//       `
//       <div style="display: flex;flex-direction:row;justify-content:center;align-items:center;margin:15px;">
//       <span class="iconify" data-icon="carbon:catalog" data-height="3em" style="margin-right: 10px;" data-inline="false"></span>
//         <h2>Alarm log</h2>
//       </div>
//       <div class="lg_log_container">
//         <div class="lg_log_container__head">
//           <div class="sender">Attacker</div>
//           <div class="townTarget">Town</div>
//           <div class="time">Time</div>
//         </div>
//         <div class="logs">
//         ${logs
//           .map(
//             (log) => `
//           <div class="lg_log_container__row">
//             <div class="sender">${log.attacker}</div>
//             <div class="townTarget">${log.city}</div>
//             <div class="time">${new Date(log.time).toLocaleString("en-GB", {
//               timeZone: Game.player_timezone,
//             })}</div>
//           </div>
//         `
//           )
//           .join("")}
//           </div>
//       </div>
//       `
//     )
//   );

//   return wrapper;
// }

function buildHelpTab() {
  let wrapper = $("<div/>", {
    style: "display:block;",
  });

  wrapper.append(
    $(
      `
      <div style="display: flex;flex-direction:row;justify-content:center;align-items:center;margin:15px;">
      <span class="iconify" data-icon="fa-solid:hands-helping" data-height="3em" style="margin-right: 10px;" data-inline="false"></span>
        <h2>Help</h2>
      </div>
      <p style="text-align:center;">
        If you need any help, please contact me via e-mail: dolinekvit@gmail.com or Discord: LG#1211
      </p>
      `
    )
  );

  return wrapper;
}

function buildDonateTab() {
  let wrapper = $("<div/>", {
    style:
      "display:flex;justify-content: center;padding: 0 25px 25px 25px;flex-direction: column;align-items: center;",
  });

  wrapper.append(
    $(
      `
      <div style="display: flex;flex-direction:row;justify-content:center;align-items:center;margin:15px;">
      <span class="iconify" data-icon="bx:bxs-donate-heart" data-height="3em" style="margin-right: 10px;" data-inline="false"></span>
        <h2>Donation</h2>
      </div>
      <form action="https://www.paypal.com/donate" method="post" target="_blank">
        <input type="hidden" name="hosted_button_id" value="HMCV2G3ZPMQSA" />
        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
        <img alt="" border="0" src="https://www.paypal.com/en_CZ/i/scr/pixel.gif" width="1" height="1" />
      </form>
      <p>
        If you want to show some love! All donations go directly to alarm development and improvement. Thank you!
      </p>
      `
    )
  );

  return wrapper;
}

function buildMobileAlarmTab() {
  let wrapper = $("<div/>", {
    style: "display: block;",
  });
  const ignoreButton = $("<div/>", {
    class: "button_new",
    id: "save_ignored_players",
    name: "Save alarm settings",
    value: "Save alarm settings",
    style: "margin: 0 auto;",
  }).button({
    caption: "Save",
  });

  wrapper.append(
    $(
      `
      <div style="display: flex;flex-direction:row;justify-content:center;align-items:center;margin:15px;">
        <span class="iconify" data-icon="fa:mobile" data-height="3em" data-inline="false" style="margin-right: 10px;"></span>
        <h2>Mobile alarm settings</h2>
      </div>
      <div class="lg_container">
        <div class="lg_container__box">
          <div class="lg_container__box_title">
            <span class="iconify" data-icon="system-uicons:bell-disabled" data-height="2em" data-inline="false"></span>
            <span>Catapush user ID</span>
          </div>
          <input id="catapush_id" name="antiSpamCatapushId" value="${localStorage.getItem(
            "antiSpamCatapushId"
          )}"/>
          <small class="lg_container__box_subtitle">
            ID format is reflecting your phone number
          </small>
        </div>
      </div>
      <div class="lg_alarm__save_button">
        <div class="button_new">
          ${ignoreButton[0].innerHTML}
        </div>
      </div>
      `
    )
  );

  return wrapper;
}

function buildIgnorePlayersTab() {
  let wrapper = $("<div/>", {
    style: "display:block;",
  });
  const ignoreButton = $("<div/>", {
    class: "button_new",
    id: "save_ignored_players",
    name: "Save alarm settings",
    value: "Save alarm settings",
    style: "margin: 0 auto;",
  }).button({
    caption: "Save",
  });
  wrapper.append(
    $(
      `
      <div style="display: flex;flex-direction:row;justify-content:center;align-items:center;margin:15px;">
        <span class="iconify" data-icon="ri:sword-fill" data-height="3em" data-inline="false" style="margin-right: 10px;"></span>
        <h2>Attack alarm settings</h2>
      </div>
      <div class="lg_container">
        <div class="lg_container__box">
          <div class="lg_container__box_title">
            <span class="iconify" data-icon="system-uicons:bell-disabled" data-height="2em" data-inline="false"></span>
            <span>Ignored players</span>
          </div>
          <textarea id="ignored_players" name="antiSpamIgnoredPlayers">${localStorage.getItem(
            "antiSpamIgnoredPlayers"
          )}</textarea>
          <small class="lg_container__box_subtitle">
            Divide each player name with ;
          </small>
        </div>
        <div class="lg_container__box">
          <div class="lg_container__box_title">
          <span class="iconify" data-icon="tabler:award" data-height="2em" data-inline="false"></span>
            <span>Minimum player points</span>
          </div>
          <input id="ignored_points" name="antiSpamIgnoredPoints" value="${
            localStorage.getItem("antiSpamIgnoredPoints") || 0
          }" />
          <small class="lg_container__box_subtitle">
            The alarm won't trigger if the attacker has less points than defined. 0 = not set
          </small>
        </div>
        <div class="lg_container__box">
          <div class="lg_container__box_title">
          <span class="iconify" data-icon="ic:outline-watch-later" data-height="2em" data-inline="false"></span>
            <span>Delay</span>
          </div>
          <input id="delay" name="antiSpamDelay" value="${
            localStorage.getItem("antiSpamAlarmDelay") || 0
          }" />
          <small class="lg_container__box_subtitle">
            Delay is in seconds. 0 = no alarm delay
          </small>
        </div>
        <div class="lg_container__box">
          <div class="lg_container__box_title">
          <span class="iconify" data-icon="la:soundcloud" data-height="2em" data-inline="false"></span>
            <span>Custom sound</span>
          </div>
          Coming soon...
        </div>
        <div class="lg_container__box">
          <div class="lg_container__box_title">
          <span class="iconify" data-icon="ri:volume-down-fill" data-height="2em" data-inline="false"></span>
            <span>Volume</span>
          </div>
          <div class="volume-wrapper" style="display: flex;width: 100%;align-items: center;justify-content: space-evenly;">
            <div class="windowmgr_slider" style="width: 80%">
              <div class="grepo_slider" id="alarm_script_volume_slider">
                <div class="button_down left js-button-left"></div>
                <div class="bar js-slider js-slider-handle-container"></div>
                <div class="button_up right js-button-right"></div>
              </div>
            </div>
            <span id="lg_alarm__volume" class="lg_alarm__volume">${
              LGAntiSpam.alarm.node.volume * 100
            }%</span>
          </div>
        </div>
        <div class="lg_container__box">
          <div class="lg_container__box_title">
          <span class="iconify" data-icon="mdi:dev-to" data-height="2em" data-inline="false"></span>
            <span>Information</span>
          </div>
          <span>Version: 2.3</span><br />
          <span>Release date: 14/3/2021</span>
        </div>
      </div>
      <div class="lg_alarm__save_button">
        <div class="button_new">
          ${ignoreButton[0].innerHTML}
        </div>
      </div>
`
    )
  );

  return wrapper;
}

(function () {
  const menu = setInterval(function () {
    if (document.querySelector("li.main_menu_item.last")) {
      const iconSpan = document.createElement("span");
      iconSpan.setAttribute("class", "icon");
      iconSpan.innerHTML = "⚔️";
      iconSpan.setAttribute(
        "style",
        "font-size: 14px; position: absolute; left: 4px !important;"
      );

      const uiHighlightDiv = document.createElement("div");
      uiHighlightDiv.setAttribute("class", "ui_highlight");
      uiHighlightDiv.setAttribute("data-type", "main_menu");

      const buttonSpan = document.createElement("span");
      buttonSpan.setAttribute("class", "button");
      buttonSpan.setAttribute("id", "spam_attack_button");
      const nameSpan = document.createElement("span");
      nameSpan.setAttribute("class", "name");
      nameSpan.innerHTML = "Attack alarm";

      const buttonWrapperSpan = document.createElement("span");
      buttonWrapperSpan.setAttribute("class", "button_wrapper");
      const nameWrapperSpan = document.createElement("span");
      nameWrapperSpan.setAttribute("class", "name_wrapper");

      const contentWrapperSpan = document.createElement("span");
      contentWrapperSpan.setAttribute("class", "content_wrapper");

      const liItem = document.createElement("li");
      liItem.setAttribute("id", "attack_alarm_menu");
      liItem.setAttribute("class", "main_menu_item");
      liItem.appendChild(contentWrapperSpan);
      contentWrapperSpan
        .appendChild(buttonWrapperSpan)
        .appendChild(nameWrapperSpan);
      buttonWrapperSpan.appendChild(buttonSpan);
      buttonSpan.appendChild(iconSpan);
      buttonSpan.appendChild(uiHighlightDiv);
      nameWrapperSpan.appendChild(nameSpan);
      const lastMenuItem = document.querySelector("li.main_menu_item.last");
      liItem.addEventListener("click", () => WF.open("antispam"));

      if (document.getElementsByClassName("main_menu_item").length === 8) {
        document
          .querySelector("div.nui_main_menu > div.middle > div.content > ul")
          .setAttribute("style", "height: 293px");
      } else if (
        document.getElementsByClassName("main_menu_item").length === 9
      ) {
        document
          .querySelector("div.nui_main_menu > div.middle > div.content > ul")
          .setAttribute("style", "height: 330px");
      } else {
        let height;

        document
          .querySelector("div.nui_main_menu > div.middle > div.content > ul")
          .getAttribute("style")
          .split(";")
          .forEach((style) => {
            if (style.search("height") !== -1) {
              height = style.replace("height: ", "");
            }
          });

        height = height.replace("px", "");

        document
          .querySelector("div.nui_main_menu > div.middle > div.content > ul")
          .setAttribute("style", `height: ${parseInt(height) + 35}px`);
      }

      lastMenuItem.parentNode.insertBefore(liItem, lastMenuItem);
      clearInterval(menu);
    }
  }, 100);
})();

function setLocalStorageItems() {
  if (!localStorage.getItem("antiSpamIgnoredPlayers"))
    localStorage.setItem("antiSpamIgnoredPlayers", "");
  if (!localStorage.getItem("antiSpamIgnoredPoints"))
    localStorage.setItem("antiSpamIgnoredPoints", 0);
  if (!localStorage.getItem("antiSpamAlarmDelay"))
    localStorage.setItem("antiSpamAlarmDelay", 0);
  if (!localStorage.getItem("antiSpamAlarmVolume"))
    localStorage.setItem("antiSpamAlarmVolume", 50);
  if (!localStorage.getItem("antiSpamCatapushId"))
    localStorage.setItem("antiSpamCatapushId", "");
}

$(document).on("game:load", function () {
  injectStylesheet(
    "https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css"
  );
  injectStylesheet(
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/css/all.min.css"
  );
  setLocalStorageItems();

  LGAntiSpam.alarm.registerListener(function (soundOn) {
    if (soundOn) {
      LGAntiSpam.alarm.node.play();
      $(".lg_alarm").removeClass("lg__hidden");
      $(".lg_alarm").addClass("lg__visible");
    } else {
      LGAntiSpam.alarm.node.pause();
      $(".lg_alarm").addClass("lg__hidden");
      $(".lg_alarm").removeClass("lg__visible");
    }
  });

  const alarmWrapper = $("<div />", {
    class: "lg_alarm",
    style: `${$(".notification").length && "margin-right: 41px"};display:none;`,
  });
  alarmWrapper.append(`<div class="lg_alarm__button">
	<div class="lg_alarm__button_border"></div>
  <div style="display: flex;align-items: center;width: 100%;height: 100%;justify-content: center;color: white;">
	<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M14 3V3.28988C16.8915 4.15043 19 6.82898 19 10V17H20V19H4V17H5V10C5 6.82898 7.10851 4.15043 10 3.28988V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3ZM7 17H17V10C17 7.23858 14.7614 5 12 5C9.23858 5 7 7.23858 7 10V17ZM14 21V20H10V21C10 22.1046 10.8954 23 12 23C13.1046 23 14 22.1046 14 21Z"
    fill="currentColor"
  />
</svg>
</div>
</div>
`);
  $("#ui_box").append(alarmWrapper);

  $(".lg_alarm").on("click", function () {
    LGAntiSpam.alarm.deactivateSound();
  });
  (function () {
    var a = w.GameControllers.TabController.extend({
      render: function () {
        this.getWindowModel().showLoading();
        this.$el.html(buildIgnorePlayersTab());
        $("#volume_input").val(
          `${parseInt(localStorage.getItem("antiSpamAlarmVolume"))}%`
        );
        const volume = $("#alarm_script_volume_slider").grepoSlider({
          min: 0,
          max: 100,
          step: 5,
          value: LGAntiSpam.alarm.node.volume * 100,
        });
        volume.on("sl:change:value", (e, _sl, v) => {
          $(".lg_alarm__volume").text(`${v}%`);
          LGAntiSpam.alarm.node.volume = v / 100;
        });
        setTimeout(
          () =>
            volume.setValue(
              parseInt(localStorage.getItem("antiSpamAlarmVolume"))
            ),
          0
        );
        $(".lg_alarm__save_button").on("click", function () {
          localStorage.setItem(
            "antiSpamIgnoredPlayers",
            $("#ignored_players").val()
          );
          localStorage.setItem(
            "antiSpamIgnoredPoints",
            $("#ignored_points").val()
          );
          localStorage.setItem("antiSpamAlarmDelay", $("#delay").val());
          localStorage.setItem(
            "antiSpamAlarmVolume",
            $("#lg_alarm__volume").text().replace("%", "")
          );
          setTimeout(function () {
            HumanMessage.success("Attack alarm successfully updated.");
          }, 0);
        });

        WM.getWindowByType("antispam")[0].hideLoading();
      },
    });
    w.GameViews.LGAttackAlarm = a;
  })();

  (function () {
    var a = w.GameControllers.TabController.extend({
      render: function () {
        this.getWindowModel().showLoading();
        this.$el.html(buildMobileAlarmTab());
        $(".lg_alarm__save_button").on("click", function () {
          localStorage.setItem("antiSpamCatapushId", $("#catapush_id").val());
        });
        this.getWindowModel().hideLoading();
      },
    });
    w.GameViews.LGMobileAlarm = a;
  })();

  (function () {
    var a = w.GameControllers.TabController.extend({
      render: function () {
        this.getWindowModel().showLoading();
        this.$el.html(buildDonateTab());
        this.getWindowModel().hideLoading();
      },
    });
    w.GameViews.LGDonate = a;
  })();

  (function () {
    var a = w.GameControllers.TabController.extend({
      render: function () {
        this.getWindowModel().showLoading();
        this.$el.html(buildGuideTab());
        this.getWindowModel().hideLoading();
      },
    });
    w.GameViews.LGGuide = a;
  })();
  // (function () {
  //   var a = w.GameControllers.TabController.extend({
  //     render: async function () {
  //       this.getWindowModel().showLoading();
  //       const html = await buildLogTab();
  //       this.$el.html(html);
  //       this.getWindowModel().hideLoading();
  //     },
  //   });
  //   w.GameViews.LGLog = a;
  // })();
  (function () {
    var a = w.GameControllers.TabController.extend({
      render: function () {
        this.getWindowModel().showLoading();
        this.$el.html(buildHelpTab());
        this.getWindowModel().hideLoading();
      },
    });
    w.GameViews.LGHelp = a;
  })();

  (function () {
    require("game/windows/ids").ANTISPAM = "antispam";
    var a = w.GameViews,
      b = w.WindowFactorySettings,
      c = require("game/windows/ids"),
      e = require("game/windows/tabs"),
      f = c.ANTISPAM;
    b[f] = function (b) {
      b = b || {};

      return us.extend({
        title: "Anti-Spam Script Settings",
        window_type: f,
        minheight: 475,
        maxheight: 630,
        width: 830,
        tabs: [
          {
            type: "ignorePlayers",
            title: "Settings",
            content_view_constructor: a.LGAttackAlarm,
            hidden: !1,
          },
          {
            type: "mobileAlarm",
            title: "Mobile alarm",
            content_view_constructor: a.LGMobileAlarm,
            hidden: !1,
          },
          {
            type: "guide",
            title: "Guide",
            content_view_constructor: a.LGGuide,
            hidden: !1,
          },
          // {
          //   type: "alarmLog",
          //   title: "Alarm log",
          //   content_view_constructor: a.LGLog,
          //   hidden: !1,
          // },
          {
            type: "lghelp",
            title: "Help",
            content_view_constructor: a.LGHelp,
            hidden: !1,
          },
          {
            type: "donate",
            title: "Donate",
            content_view_constructor: a.LGDonate,
            hidden: !1,
          },
        ],
        max_instances: 1,
        activepagenr: 0,
        minimizable: !0,
      });
    };
  })();
});

(async function () {
  "use strict";

  if (!Game.world_id && !Game.player_id) return;
  const movement = [];
  let commandIdsForAlarm = movement.map((log) => log.movementId);
  $.Observer("attack:incoming").subscribe(() => {
    setTimeout(() => {
      const movements = Object.values(MM.getModels().MovementsUnits);

      movements.map(async (movement) => {
        if (!movement.isIncommingAttack()) return;

        let townData;
        townData = await fetch(
          `https://api.grepodata.com/town?world=${
            Game.world_id
          }&id=${movement.getHomeTownId()}`
        )
          .then((response) => response.json())
          .catch(() =>
            fetch(
              `https://dolinek.dev/town/${
                Game.world_id
              }/${movement.getHomeTownId()}/player`
            ).then((response) => response.json())
          );
        const homeTown = ITowns.towns[movement.getTargetTownId()];

        if (!commandIdsForAlarm.includes(movement.getId())) {
                    if (
            !localStorage
              .getItem("antiSpamIgnoredPlayers")
              .split(";")
              .find(
                (name) =>
                  name.toLowerCase() === townData.player_data.name.toLowerCase()
              )
          ) {
            if (
              townData.player_data.points <
              parseInt(localStorage.getItem("antiSpamIgnoredPoints"), 10)
            )
              return false;
            if (parseInt(localStorage.getItem("antiSpamAlarmDelay"), 10) > 0) {
              setTimeout(() => {
                LGAntiSpam.alarm.activateSound();
              }, parseInt(localStorage.getItem("antiSpamAlarmDelay"), 10) * 1000);

              return false;
            }

            if (localStorage.getItem("antiSpamCatapushId")) {
              console.log("3");
              await fetch(`https://api.catapush.com/1/messages`, {
                method: "post",
                headers: new Headers({
                  Authorization:
                    "Bearer 8aead2eef413007e238beb7789c40171d2a298a9",
                  "Content-Type": "application/json",
                  accept: "application/json",
                }),
                body: JSON.stringify({
                  mobileAppId: 318,
                  text: `Your city ${movement.attributes.town_name_destination} is being attacked by ${townData.player_data.name}. Arrival ${movement.attributes.arrived_human}`,
                  recipients: [
                    {
                      identifier: localStorage.getItem("antiSpamCatapushId"),
                    },
                  ],
                }),
              });
            }

            if (!LGAntiSpam.alarm.sound) LGAntiSpam.alarm.activateSound();
          }

          commandIdsForAlarm.push(movement.getId());
        }
      });
    }, 1);
  });
})();

(function () {
  $('head').append(
    `<style>
  .lg_alarm {
    position: absolute;
    bottom: 50px;
    right: 70px;
    width: 100px;
    height: 100px;
    z-index: 5;
  }
  
  .lg__hidden {
    display: none !important;
  }
  
  .lg__visible {
    display: block !important;
  }
  
  .lg_alarm__save_button {
    display: inline-flex;
    align-content: center;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
  }
  
  .lg_alarm__button,
  .lg_alarm__button_border,
  .lg_alarm__button_bell {
    cursor: pointer;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .lg_alarm__button {
    height: 60px;
    width: 60px;
    box-shadow: -1px 2px 10px #999;
    background: #ef7575;
    animation-name: col;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
  .lg_alarm__button_border {
    height: 59px;
    width: 59px;
    border: 1px solid #ef7575 !important;
    animation-name: bord-pop;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    box-shadow: 2px 2px 5px #ccc, -2px -2px 5px #ccc;
  }
  .lg_alarm__button_bell {
    color: white;
    font-size: 20px;
    animation-name: bell-ring;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
  
  .lg_alarm__no_animation {
    animation: none !important;
  }
  
  @keyframes bord-pop {
    0% {
      transform: translate(-50%, -50%);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.9);
      opacity: 0.1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.9);
      opacity: 0;
    }
  }
  @keyframes col {
    0% {
      transform: scale(1) translate(0, 0);
    }
    10% {
      transform: scale(1.1) translate(0, 0);
    }
    75% {
      transform: scale(1) translate(0, 0);
    }
    100% {
      transform: scale(1) translate(0, 0);
    }
  }
  @keyframes bell-ring {
    0% {
      transform: translate(-50%, -50%);
    }
    5%,
    15% {
      transform: translate(-50%, -50%) rotate(25deg);
    }
    10%,
    20% {
      transform: translate(-50%, -50%) rotate(-25deg);
    }
    25% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
  }
  
  /* GRID */
  .lg_container {
    display: grid;
    grid-row-gap: 5px;
    grid-column-gap: 5px;
    grid-template-columns: repeat(auto-fit, minmax(calc(50% - 5px), 1fr));
  }
  
  .lg_container__box {
    background: #f7e4cb;
    margin: 0 5px;
    padding: 10px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
      rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  }
  
  .lg_container__box_title {
    width: 100%;
    font-size: 13px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
  }
  
  .lg_container__box_title span {
    font-weight: 700;
  }
  
  .lg_container__box_title svg {
    margin-right: 5px;
  }
  
  .lg_container__box_helper {
    padding-top: 5px;
  }
  
  .lg_container__box input,
  .lg_container__box textarea {
    width: calc(100% - 10px);
  }
  
  .lg_log_container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  
  .lg_log_container__head {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    text-align: center;
    font-weight: 900;
    font-size: larger;
  }
  
  .lg_log_container__row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    text-align: center;
    padding: 5px 0;
    background: #f7e4cb;
    margin: 5px;
  }  
  </style>`
  )
})();