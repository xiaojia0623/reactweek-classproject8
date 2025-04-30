const AboutUsPage = () => {
  return (
    <>
    <div className='mt-3 mt-md-5 mb-3 mb-md-5' data-aos="fade-down-left">
        <h2 className='text-center fw-bold'>關於我們</h2>
    </div>

    <div className="container mb-2 mb-md-5 flex-column" data-aos="fade-down-left">
        <h3 className='concept mb-3 mb-md-0'>我們創作的理念</h3>
        <div className="creative-concept d-flex align-items-center justify-content-between g-md-5 flex-column flex-md-column flex-lg-row">
            <p className="concept-content p-0 p-md-4 fs-4 text-start" style={{textIndent:'2em'}}>
            能把陶瓷創意設計新思維，讓更多人分享，是ㄧ種幸福的事。面對充滿壓力的生活環境，
            我們可以選擇ㄧ種輕鬆悠閒的生活方式，選擇質感、儉約素樸的現代優雅，不需多餘的
            表面裝飾，用線條與型態，簡單的呈現陶瓷意涵，提升器物的層次與深度。曹老師從事以
            陶瓷為素材之創作經歷近30年，設計偏好現代簡約風格與對比色彩的搭配，並融入生活情
            感故事，以新思維創作生活實用陶瓷的全新風貌。經多年來的努力尋找自我的創作定位，
            終能有一番堅持，擁有一方耕耘的夢想園地，幸運感恩。

            </p>
            <img style={{width:'100%'}} className='rounded-3' src="https://images.unsplash.com/photo-1590605105526-5c08f63f89aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2VyYW1pY3N8ZW58MHx8MHx8fDA%3D" alt="" />
        </div>
    </div>

    <div className="container mt-5 mt-md-0 mb-5" data-aos="fade-up">
        <h3 className='concept mb-3 mb-md-5'>獲獎紀錄</h3>
        <ul className="awards">
            <li>
                <p className='fs-4'>
                挽回系列的作品，曾獲得了鶯歌陶瓷博物館2007陶瓷創意新品評鑑展，【最佳創意獎】、【美感創意獎】及【市場明星獎】
                三大獎項，是相當風光的一件作品，佔有三個重要獎項，可見設計概念獨具創意。
                </p>
            </li>
            <li>
                <p className='fs-4'>
                融合茶具組，鶯歌陶瓷博物館 2006創意生活 陶瓷新品評鑑展 入選
                </p>
            </li>
            <li>
                <p className='fs-4'>
                融合餐具組，2008陶瓷金質獎 創意餐具組 銀獎
                </p>
            </li>
            <li>
                <p className='fs-4'>
                舞，2008陶瓷創意餐具金質獎 創意餐具組 單品入選
                </p>
            </li>
            <li>
                <p className='fs-4'>
                你儂我儂，2007陶瓷新品評鑑展入選 ，分離組合結構專利產品 專利號 M 277379 號
                </p>
            </li>
            <li>
                <p className='fs-4'>
                迴，2009 陶瓷青花艷品牌計畫 入選
                </p>
            </li>
            <li>
                <p className='fs-4'>
                向前，2010第五屆台灣陶瓷金質獎  優選
                </p>
            </li>
        </ul>
    </div>

    <div className="container mb-5" data-aos="fade-up">
        <h3 className='concept mb-3 mb-md-5'>品牌故事</h3>
        <p className='fs-4' style={{textIndent:'2em'}}>
        你是不是有時候，獨自一個人獨處的時候，會閃過一個這樣的念頭──如果那時候的歲月、日子、時間、童年、
        愛情……能夠再回到當時的時光中，不知道有多好，或許可以再來一次，做不同的選擇，不會後悔的抉擇，如果，
        重新過一遍的話，那該有多麼美好啊……！你我都曾經為了某個人、某件事，或是已逝去的感到悲傷難過，
        但是過去了畢竟就是過去了，即便我們有再大的能力，也追不回來，能留下來的，或許就是一個個令人動容的回
        憶，是影像，抑或是圖片式的記憶，深印在心底的某一處。挽回系列，就是想讓我們追回曾經所擁有的，一個傾
        斜的圓柱形的杯子形狀，似乎在訴說的我們的日子，經過了歲月的累積以及辛勞，已經有點偏離當初最想追求
        的目標。在把手的設計中，有一個黑色小人，試圖將我們偏離的軌道拉回，再次將最初的幸福追回，或是在人生路上找到平衡點。

        </p>
    </div>

    <div className="container mb-5 bg-color p-3 p-md-5" data-aos="fade-up">
        <h3 className='concept mb-3 mb-md-5'>參與電視劇錄製</h3>
        <ul className="product-video row row-cols-1 row-cols-md-2 list-unstyled d-flex flex-column flex-md-row flex-wrap g-3">
            <li className='col'>
                <p className='fs-4'>偶像劇-醉後決定愛上你-片段</p>
                <img style={{width:'100%', objectFit:'cover'}} src="https://firebasestorage.googleapis.com/v0/b/react-ecommerce-contact-97bdb.appspot.com/o/%E8%9E%A2%E5%B9%95%E6%93%B7%E5%8F%96%E7%95%AB%E9%9D%A2%202025-03-13%20193459.png?alt=media&token=7d463478-6514-43fa-a620-01a432cdc73a" alt="醉後決定愛上你-片段" />
            </li>
        </ul>
    </div>
    </>
  )
}

export default AboutUsPage
