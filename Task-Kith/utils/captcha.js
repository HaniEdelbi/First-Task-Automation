const axios = require("axios");

async function solveCaptcha(page) {
  const API_KEY = "c93e2835######";
  const TARGET_URL = "https://kith.com/";
  let sitekey;
  try {
    const selectors = [
      "[data-sitekey]",
      ".h-captcha[data-sitekey]",
      "div[data-sitekey]",
      "[data-site-key]",
      ".h-captcha",
      "iframe[src*='hcaptcha.com']",
    ];

    for (const selector of selectors) {
      try {
        if (selector.includes("iframe")) {
          const iframe = await page.$(selector);
          if (iframe) {
            const src = await iframe.evaluate((el) => el.src);
            const match = src.match(/sitekey=([^&]+)/);
            if (match) {
              sitekey = match[1];
              break;
            }
          }
        } else {
          sitekey = await page.$eval(
            selector,
            (el) =>
              el.getAttribute("data-sitekey") ||
              el.getAttribute("data-site-key")
          );
          if (sitekey) break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!sitekey) {
      sitekey = await page.evaluate(() => {
        const scripts = document.querySelectorAll("script");
        for (const script of scripts) {
          const content = script.textContent || script.innerText;
          const match = content.match(
            /sitekey["':\s]+["']([a-f0-9\-]{36})["']/i
          );
          if (match) return match[1];
        }

        if (window.hcaptcha_config && window.hcaptcha_config.sitekey) {
          return window.hcaptcha_config.sitekey;
        }

        return null;
      });
    }
  } catch (error) {
    console.error("Error finding sitekey:", error.message);
  }

  if (!sitekey) {
    console.error("Could not find hCaptcha sitekey on the page");
    await browser.close();
    return;
  }

  console.log("Sitekey:", sitekey);

  const submitRes = await axios.get("https://api.solvecaptcha.com/in.php", {
    params: {
      key: API_KEY,
      method: "hcaptcha",
      sitekey,
      pageurl: TARGET_URL,
      json: 1,
    },
  });

  const captchaId = submitRes.data.request;
  console.log("Submitted CAPTCHA, ID:", captchaId);

  let token;
  let userAgent;
  for (let i = 0; i < 20; i++) {
    await new Promise((res) => setTimeout(res, 5000));

    const result = await axios.get("https://api.solvecaptcha.com/res.php", {
      params: {
        key: API_KEY,
        action: "get",
        id: captchaId,
        json: 1,
      },
    });

    if (result.data.status === 1) {
      token = result.data.request;
      userAgent = result.data.useragent;
      break;
    }

    console.log("Waiting for CAPTCHA solution...");
  }

  if (!token) {
    console.error("Token not received.");
    return;
  }
  console.log("Token received:", token);

  await page.setUserAgent(userAgent);

  await page.evaluate((token) => {
    const textarea = document.querySelector(
      'textarea[name="h-captcha-response"]'
    );
    if (textarea) textarea.value = token;

    const hcaptchaWidget = document.querySelector(".h-captcha");
    if (hcaptchaWidget) {
      const responseTextarea = hcaptchaWidget.querySelector(
        'textarea[name="h-captcha-response"]'
      );
      if (responseTextarea) {
        responseTextarea.value = token;
      }

      if (window.hcaptcha) {
        try {
          const widgetId = hcaptchaWidget.getAttribute(
            "data-hcaptcha-widget-id"
          );

          let widget = null;

          if (
            widgetId &&
            window.hcaptcha.nodes &&
            window.hcaptcha.nodes.getById
          ) {
            widget = window.hcaptcha.nodes.getById(widgetId);
          } else if (
            window.hcaptcha.nodes &&
            window.hcaptcha.nodes.getByIndex
          ) {
            widget = window.hcaptcha.nodes.getByIndex(0);
          }

          if (widget && widget.checkbox) {
            widget.checkbox.response = token;

            widget.checkbox.completed = true;
            widget.checkbox.solved = true;
            widget.checkbox.verified = true;

            if (widget.checkbox.onSolve) {
              widget.checkbox.onSolve(token);
            }

            if (widget.checkbox.setState) {
              widget.checkbox.setState("solved");
            }

            if (
              widget.checkbox.callback &&
              typeof widget.checkbox.callback === "function"
            ) {
              widget.checkbox.callback(token);
            }

            if (widget.onSuccess && typeof widget.onSuccess === "function") {
              widget.onSuccess(token);
            }

            if (widget.checkbox.element) {
              widget.checkbox.element.classList.add("h-captcha-success");
              widget.checkbox.element.classList.remove("h-captcha-error");

              const checkboxIcon = widget.checkbox.element.querySelector(
                ".h-captcha-checkbox"
              );
              if (checkboxIcon) {
                checkboxIcon.classList.add("h-captcha-checkbox-checked");
              }
            }

            const currentResponse = window.hcaptcha.getResponse(widgetId);
            console.log("Set hCaptcha response:", currentResponse);
          }

          const callbacks = [
            hcaptchaWidget.getAttribute("data-callback"),
            "hcaptchaCallback",
            "onHcaptchaSuccess",
            "handleHcaptchaSuccess",
          ];

          for (const callbackName of callbacks) {
            if (callbackName && typeof window[callbackName] === "function") {
              try {
                window[callbackName](token);
              } catch (e) {
                console.log(`Callback ${callbackName} failed:`, e.message);
              }
            }
          }

          const events = [
            "hcaptcha:success",
            "captcha:solved",
            "verification:complete",
          ];
          for (const eventName of events) {
            hcaptchaWidget.dispatchEvent(
              new CustomEvent(eventName, {
                detail: { token, response: token },
                bubbles: true,
              })
            );
          }
        } catch (error) {
          console.log("hCaptcha API trigger failed:", error.message);
        }
      }

      const form = hcaptchaWidget.closest("form");
      if (form) {
        ["change", "input", "blur", "focusout"].forEach((eventType) => {
          if (responseTextarea) {
            responseTextarea.dispatchEvent(
              new Event(eventType, { bubbles: true })
            );
          }
          form.dispatchEvent(new Event(eventType, { bubbles: true }));
        });

        if (form.checkValidity) {
          form.checkValidity();
        }
      }
    }
  }, token);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Submitted form with token.");
}
module.exports = { solveCaptcha };
