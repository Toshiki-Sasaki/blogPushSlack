
var SHEET_NAME = "最新ブログ"
var MEMBER_SHEET_NAME = "メンバー"
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

function main() {
  BLOGS = getBlogs()
  SLACK_INCOMING_URL = getProperty('SLACK_INCOMING_URL')
  for(key in BLOGS){
    Logger.log(key)
    var link = BLOGS[key][0]
    var html = UrlFetchApp.fetch( link ).getContentText()
    var color = BLOGS[key][1]
    var items = Parser.data(html).from('<div class="p-blog-group">').to('<div class="p-button__blog_detail">').iterate()
    var item = items[0].replace(/\r?\n/g, '')
    var title = item.match(/<div class="c-blog-article__title">(.+?)<\/div>/)[1].replace(/^\s+/,"").replace(/\s+$/,"")
    
    var images = Parser.data(html).from('<div class="l-sub-contents--blog">').to('<div class="p-blog-member__head">').iterate()
    var image = images[0].replace(/\r?\n/g, '').match(/<div class="c-blog-member__icon" style="background-image:url\((.+?)\);"><\/div>/)[1]
    
    if ( isUpdated(key, title) ){
      sendSlack(makeAttachment(key, link, title, color, image), key, link, SLACK_INCOMING_URL)
    }
  }
}

function getProperty(key){
  return PropertiesService.getScriptProperties().getProperty(key) 
}

function getBlogs(){
  var myarray = []
  SHEET_ID = getProperty('SHEET_ID')
  var SPREADSHEET = SpreadsheetApp.openById(SHEET_ID)
  var SHEET = SPREADSHEET.getSheetByName(MEMBER_SHEET_NAME)
  var ROWS = SHEET.getDataRange()
  var VALUES = ROWS.getValues()
  var obj = {}
  for (var i=0; i<VALUES.length; i++){
    name = String( VALUES[i][0] )
    link = VALUES[i][1]
    color = VALUES[i][2]
    obj[name] = [link, color]
  }
  
  Logger.log(obj)
  return obj
}

function isUpdated(key, title){
  var SPREADSHEET = SpreadsheetApp.openById(SHEET_ID)
  var SHEET = SPREADSHEET.getSheetByName(SHEET_NAME)
  var [numCol, currentTitle] = readSpreadsheet(key, title, SHEET)
  if (currentTitle!=title){
    UpdateSpreadsheet(numCol, key, title, SHEET)
    return true
  } else {
    return false
    }
}

function readSpreadsheet(key, title, SHEET){
  var currentTitle = ''
  var ROWS = SHEET.getDataRange()
  var VALUES = ROWS.getValues()
  var ROWNUM = VALUES.length
  var COLNUM = VALUES[0].length
  var updateCol = ALPHABET[COLNUM]
  
  if (ROWNUM!=1){
    for (var i=0; i<=COLNUM; i++){
      var colNum = ALPHABET[i]+'2'
      var keyCol = ALPHABET[i]+'1'
      var col = SHEET.getRange(keyCol).getValue()
      if (col==key){
        currentTitle = SHEET.getRange(colNum).getValue()
        updateCol = colNum
      }
    }
  }
  else {
    var updateCol = 'A2'
  }
  return [updateCol[0], currentTitle.replace(/^\s+/,"").replace(/\s+$/,"")]
}

function UpdateSpreadsheet(col, key, title, SHEET){
  SHEET.getRange(col+'1').setValue(key)
  SHEET.getRange(col+'2').setValue(title)
}

function makeAttachment(name, link, title, color, image){
  return [{
    'color': color,
    'title': title,
    'image_url': image,
  }]
}

function sendSlack(attachments, key, link, SLACK_INCOMING_URL) {
  var jsonData = {
    username:   '日向坂ブログbot',
    icon_emoji: ':日向坂アイコン:',
    channel:    '日向坂ブログ',
    text: 'アップデート情報です \n'+key+'さんがブログを更新しました。\n'+link,
    attachments: attachments,
  }
  payload = JSON.stringify(jsonData)
  options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload
  }
  
  UrlFetchApp.fetch(SLACK_INCOMING_URL, options)
}
