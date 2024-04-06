window.onload = async function() {
    let { pdfjsLib } = window;
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';

    // 获取所有的pdf标签
    let pdfTags = document.getElementsByTagName('pdf');

    for (let i = 0; i < pdfTags.length; i++) {
        // 获取PDF文件的路径
        let pdfPath = pdfTags[i].getAttribute('src');
        console.log(pdfPath);

        // 读取PDF文件
        let loadingTask = pdfjsLib.getDocument(pdfPath);
        let pdf = await loadingTask.promise;

        // 获取PDF的总页数
        let totalPages = pdf.numPages;
        console.log(totalPages);

        for (let j = 1; j <= totalPages; j++) {
            let page = await pdf.getPage(j);

            // 设置期望的输出图像大小
            let viewport = page.getViewport({ scale: 5.0 });
            let canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            let context = canvas.getContext('2d');

            // 将PDF页面渲染到canvas上
            let renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;

            // 将canvas转换为图像并添加到pdf标签中
            let img = document.createElement('img');
            img.src = canvas.toDataURL();
            pdfTags[i].appendChild(img);
        }
    }
};