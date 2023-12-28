const axios = require('axios');
const fs = require('fs');
const XLSX = require('xlsx');
/*
function findCategoryById(categories, id) {
  for (const category of categories) {
    if (category.$ && category.$.id === id) {
      return category._;
    }
  }
  return null;
}
*/

let csvData = [[
  'id',
  'drug_id',
  'drug_name',
  'drug_producer',
  'pharmacy_id',
  'pharmacy_name',
  'pharmacy_region',
  'pharmacy_address',
  'price',
  'availability_status',
  'created_at',
]];


const getApiData = async(search) => {
  try {
    const response = await axios.get(`https://zr.in.ua/product/${search}/prices`);
    return response.data.data;
  } catch (error) {
    console.error('Помилка при отриманні XML: ', error);
    return
    throw error;
  }
}


function textBeforeComma(text) {

  if (!text.includes(",")) {
    return ['null', 'null'];
  }

  return text.split(",");
}


function convertArrayToSheet(APIdata) {
  if (APIdata == undefined) {
    return
  }
  if (APIdata.prices.other[0] == undefined) {
    return
  }


  console.log(APIdata.prices.other[0])
  APIdata.prices.other.forEach((item) => {

        const location = textBeforeComma(item.pharmacy.address);

        csvData.push([
          '0',
          item.product_id,
          APIdata.product.name,
          'невідомо',
          item.pharmacy_id,
          item.pharmacy.title,
          location[0],
          location[1],
          item.price_old,
          'Забронювати',
          new Date(),
        ]
        );
  });
  //return csvData;
}



function writeArrayToXLS(arrayData, xlsFilePath) {
  try {
    const workbook = XLSX.utils.book_new();
    const sheetName = 'Sheet1';
    const worksheet = XLSX.utils.aoa_to_sheet(arrayData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, xlsFilePath);
    console.log('Масив успішно записано в XLS.');
  } catch (error) {
    console.error('Помилка під час запису масиву в XLS:', error);
  }
}

async function run() {
  try {
    
    for (let i = 60; i < 360; i++) {
      const apiData = await getApiData(i);
      const dataArray = convertArrayToSheet(apiData);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    //const dataArray = convertArrayToSheet(apiData);
    writeArrayToXLS(csvData, 'ZdorovaRoduna.xls');
  } catch (error) {
    console.error('Помилка: ', error);
  }
}

run();
/*
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const filePath = './price.xls';
  if(msg.text === 'all') {
    await run();
    fs.access('./price.xls', fs.constants.F_OK, (err) => {
      if (err) {
        bot.sendMessage(chatId, 'Файл price.xls не знайдено!');
        return;
      }
      bot.sendMessage(chatId, 'Доброго ранку до вашого ознайомлення свіжий прайс.');
      bot.sendDocument(chatId, filePath)
        .catch((error) => {
          bot.sendMessage(chatId, 'Виникла помилка під час відправлення файлу.');
          console.error(error);
      });
    });
  }
});
*/
/*
const sendMorningMessage = async () => {
  try {
    const chatId = '@mmarketkiev'; 
    await run();
    fs.access('./price.xls', fs.constants.F_OK, (err) => {
      if (err) {
        bot.sendMessage(chatId, 'Файл price.xls не знайдено!');
        return;
      }
      bot.sendMessage(chatId, 'Доброго ранку до вашого ознайомлення свіжий прайс.');
      bot.sendDocument(chatId, './price.xls', { 
        reply_markup: { 
          inline_keyboard: [[
            { 
              text: 'Для замовлення або запитань перейдіть в чат з менеджером',
              url: 'https://t.me/mmarketkiev_bot',
            }
          ]]
        }})
        .catch((error) => {
          bot.sendMessage(chatId, 'Виникла помилка під час відправлення файлу.');
          console.error(error);
      });
    });
    console.log('Повідомлення надіслано успішно.');
  } catch (error) {
    console.error('Помилка при надсиланні повідомлення:', error.message);
  }
};
*/
/*
const checkAndSendMorningMessage = () => {
  const now = new Date();
  const kievTimeZoneOffset = 3;

  if (now.getUTCHours() === 9 - kievTimeZoneOffset && now.getUTCMinutes() === 0) {
    sendMorningMessage();
  }
};

setInterval(checkAndSendMorningMessage, 60000);
*/