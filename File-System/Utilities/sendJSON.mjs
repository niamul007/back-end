
export function sendJSON(res, data, statusCode,contentType) {
  
  res.statusCode = statusCode;
  res.setHeader("Content-Type", contentType);
  res.end(data);
}