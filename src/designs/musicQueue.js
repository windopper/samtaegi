function musicQueue(queue) {
  return (
    `<html>
      <head>
        <title></title>
      </head>
      <body style="background-color: rgb(247, 244, 244);">
        <link rel="stylesheet" href="musicQueue.css" />
        <div id="root"></div>
        <style></style>
        <div
          style={{
            backgroundColor: "red",
            width: "100px",
            height: "200px",
          }}
        ></div>
      </body>
    </html>`
  );}

module.exports = {
  musicQueue: musicQueue,
};
