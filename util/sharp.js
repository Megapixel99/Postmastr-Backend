const sharp = require('sharp');
module.exports = function (image) {
    return (async () => {
        const metadata = await sharp(img).metadata()
        var width = metadata.width;
        var height = metadata.height;

        const newImg = await sharp(img).resize(width * 1.5, height * 1.5);
        return newImg

    })
}