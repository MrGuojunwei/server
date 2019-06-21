module.exports = function (returnCode, data, returnMsg) {
  return {
    returnCode: returnCode || '000000',
    data: data || '',
    returnMsg: returnMsg || ''
  }
}