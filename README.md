## Project Overview

### Key Features

- **Multi-Platform Support**: Automated workflows for Kith and ShopNiceKicks e-commerce platforms
- **Two Deployment Options**: Node.js automation, and desktop GUI application
- **Advanced CAPTCHA Handling**: Integrated hCaptcha solving with solvecaptcha service
- **Robust Error Handling**: Comprehensive retry mechanisms
- **Modular Architecture**: Clean separation of concerns with reusable utility functions
- **Real-time Logging**: Professional logging system for debugging and monitoring
- **Smart Pop-up Management**: Automated handling of cookies acceptance and other blocking elements

## Architecture & Design

The project employs a modular architecture where each functionality is encapsulated in dedicated utility modules:

```
utils/
├── navigatePage.js     # Page navigation and loading
├── selectSize.js       # Intelligent size selection with platform-specific logic
├── addToCart.js        # Cart management
├── checkOut.js         # Checkout process
├── checkoutDetails.js  # Form filling automation
├── CreditCard.js       # Payment information handling with iframe support
├── inputType.js        # Smart input field interaction
├── RemovePopup.js      # Pop-up and cookie banner handling
├── captcha.js          # CAPTCHA solving integration
├── retry.js            # Robust retry mechanisms
└── delay.js            # Timing and synchronization
```

### Hcaptcha tested to solve in hcaptcha demo using puppeteer and solvecaptcha service

![Hcaptcha Demo](https://github.com/HaniEdelbi/First-Task-Automation/blob/main/images/image.png)

## Video Demonstrations

The project includes video demonstrations showcasing:

### ShopNiceKicks Automation
[![ShopNiceKicksCMD](https://github.com/HaniEdelbi/First-Task-Automation/blob/main/images/Screenshot%202025-08-06%20201007.png)](https://github.com/HaniEdelbi/First-Task-Automation/blob/main/videos/2025-08-05%2011-13-06.mp4)

### ShopNiceKicks Electron
[![ShopNiceKicksElectron](https://github.com/HaniEdelbi/First-Task-Automation/blob/main/images/Screenshot%202025-08-06%20201311.png)](https://github.com/HaniEdelbi/First-Task-Automation/blob/main/videos/2025-08-05%2011-19-23.mp4)

### Kith Automation
[![KithCMD](https://github.com/HaniEdelbi/First-Task-Automation/blob/main/images/Screenshot%202025-08-06%20201216.png)](https://github.com/HaniEdelbi/First-Task-Automation/blob/main/videos/2025-08-05%2011-17-34.mp4)
### Usage Options

#### Option 1: CLI-Based Automation (ShopNiceKicks)

```bash
cd Task-ShopNiceKicks
npm start
```

#### Option 2: Desktop GUI Application

```bash
cd Task-ShopNiceKicks-Electron
npm start
```

#### Option 3: CLI-Based Automation (Kith)

```bash
cd Task-Kith
npm start
```

## Technical Implementation Highlights

### Kith Platform Challenges and Solutions

1. **CAPTCHA Handling**: solvecaptcha service for automated hCaptcha solving
2. **Pop-up Management**: pop-up handling including cookie acceptance banners
3. **Payment Form Complexity**: Advanced iframe handling to navigate hidden payment forms
4. **Size Selection Logic**: Platform-specific size selection adapted for Kith's unique structure

### Credit Card Processing

```javascript
async function fillCreditCardInfo(
  page,
  cardNumber,
  cardName,
  cardExpiry,
  cardCVV
) {
  await page.waitForSelector(".card-fields-iframe", { visible: true });
  const frameHandles = await page.$$(".card-fields-iframe");

  const inputValues = [
    { selector: 'input[name="number"]', value: cardNumber },
    { selector: 'input[name="expiry"]', value: cardExpiry },
    { selector: 'input[name="verification_value"]', value: cardCVV },
    { selector: 'input[name="name"]', value: cardName },
  ];

  let inputIndex = 0;

  for (let i = 0; i < frameHandles.length; i++) {
    const frameHandle = frameHandles[i];
    const frame = await frameHandle.contentFrame();

    const isHidden = await frameHandle.evaluate(
      (node) => node.closest("[hidden]") !== null
    );
    if (isHidden) continue;

    const field = inputValues[inputIndex];
    await frame.waitForSelector(field.selector, { visible: true });
    await frame.evaluate((selector) => {
      document.querySelector(selector).value = "";
    }, field.selector);
    await frame.type(field.selector, field.value, { delay: 100 });

    inputIndex++;
  }
}
```

## Desktop Application Features

### Real-time Monitoring

The Electron application provides:

- **Live Progress Tracking**: Real-time automation status updates
- **Interactive Logging**: Color-coded log entries with timestamps
- **Form Validation**: Client-side validation before automation starts
- **Visual Feedback**: Loading indicators and status animations

## Configuration

### Customizing User Data

Update the user information in the respective `index.js` files:

```javascript
// Personal Information
{
    email: "your-email@example.com",
    country: "United States",
    FirstName: "Your First Name",
    LastName: "Your Last Name",
    Address: "Your Address",
    city: "Your City",
    state: "Your State",
    Zip: "Your ZIP",
    Phone: "Your Phone Number"
}

// Payment Information
{
    Credit: "Your Credit Card Number",
    Exp: "MM/YY",
    code: "CVV",
    Name: "Name on Card"
}
```
