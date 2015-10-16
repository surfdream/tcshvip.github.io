﻿//电商协议
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    require('http://s.tcsh.me/tcsh/view/ago/public/wm_dsxy/css/style.css');
    var businesshtml = [
        '<div class="business_mian">',
            '<ul>',
                '<li>',
                    '<p>本协议由同意并承诺遵守本协议规定使用同城生活服务的法律实体（下称“商家”或“甲方”）、杭州同城生活络科技有限公司（下称“同城生活”或“乙方”）共同缔结，本协议具有合同效力。</p>',
                '</li>',
                '<li>',
                    '<h3>一、协议内容及生效：</h3>',
                    '<p>（一）本协议内容包括协议正文及所有乙方已经发布的或将来可能发布的各类规则。所有规则为协议不可分割的一部分，与协议正文具有同等法律效力。</p>',
                    '<p>（二）甲方在使用乙方提供的各项服务的同时，承诺接受并遵守各项相关规则的规定。乙方有权根据需要不时地制定、修改本协议或各类规则，如本协议有任何变更，乙方将在网站上以公示形式通知甲方。如甲方不同意相关变更，必须立即以书面通知的方式终止本协议。任何修订和新规则一经公布即自动生效，成为本协议的一部分。登录或继续使用服务将表示甲方接受经修订的协议。除另行明确声明外，任何使服务范围扩大或功能增强的新内容均受本协议约束。</p>',
                    '<p>（三）商户签署或在线接受本协议并不导致本协议立即生效，经过乙方审核通过并向甲方发出服务开通通知时，本协议即在甲方和乙方之间产生法律效力。</p>',
                '</li>',
                '<li>',
                    '<h3>二、定义：</h3>',
                    '<p><b>www.tcsh.me（同城生活）：</b>指由乙方提供技术支持和服务的电子商务平台网站，网址为http:// www.tcsh.me（或乙方根据业务需要不时修改的URL）。</p>',
                    '<p><b>乙方网上交易平台：</b>指www.tcsh.me（乙方）上供用户发布或查询商品信息，进行信息交流，达成交易意向及向用户提供其他与交易有关的辅助信息服务的空间。 </p>',
                    '<p><b>商家及商家注册：</b>商家必须是符合《同城生活2014年度招商标准》规定的法律实体，如无经营资格或违反本协议第五条之声明与保证的组织不能注册为同城生活商家或超越其民事权利或行为能力范围从事交易的，其与同城生活之间的协议自始无效，一经发现，乙方有权立即注销该商家同城生活服务账户，并追究其使用同城生活服务的一切法律责任。商家注册是指商家登陆同城生活（www.tcsh.me，按要求填写相关信息，且在线阅读并确认接受或书面签署本协议以最终激活其同城生活服务账户的过程。</p>',
                    '<p><b>同城生活服务账户：</b>即商家完成商家注册流程而获得的其将在使用服务的过程中必须与自设的账户密码共同使用的用户名，又称“同城生活用户名”。商家应妥善保管其同城生活服务账户及密码信息，商家不得以任何形式擅自转让或授权他人使用自己的同城生活服务账户；</p>',
                    '<p><b>服务：</b>是指同城生活网上交易平台向商家提供的互联网信息发布、商业推广及与此有关的互联网技术服务。具体服务内容如下：</p>',
                    '<p>1．网络信息服务：指同城生活提供的商家根据本协议的规定利用乙方网上交易平台查询商品信息、发布商品信息、作为卖方与其它用户订立商品买卖合同、评价其它用户的信用、参加乙方有关活动以及其他由乙方同意提供的信息服务。</p>',
                    '<p>2．二级域名服务：指同城生活提供的商户根据《同城生活店铺命名规范》可使用的同城生活域名下二级域名的服务，该服务必须遵照同城生活颁布的有关二级域名的相关规则并经同城生活审核通过方能开通使用。二级域名的所有权归同城生活，同城生活有权根据第三方的投诉或乙方自用原因收回二级域名，并允许商家更换二级域名。</p>',
                    '<p>3．店铺专用BBS服务：指由同城生活向商家提供的专用BBS空间，供商家发布与自销商品有关的信息，并收集同城生活其他用户对其商品及服务的反馈。</p>',
                    '<p>4．其他服务：具体服务项目以协议方在本协议附件《同城生活服务条款》或补充协议中确定。 同城生活保留在任何时候自行决定对服务及其相关功能、应用软件变更、升级的权利。同城生活进一步保留在服务中开发新的模块、功能和软件或其它语种服务的权利。上述所有新的模块、功能、软件服务的提供，除非同城生活另有说明，否则仍适用本协议。服务随时可能因同城生活的单方判断而被增加或修改，或因定期、不定期的维护而暂缓提供，商家将会得到相应的变更通知。商家在此同意同城生活在任何情况下都无需向其在使用服务时对其在传输或联络中的迟延、不准确、错误或疏漏及因此而致使的损害负责。</p>',
                    '<p><b>同城生活服务条款：</b>由协议方另行签署的确认与本协议服务有关的各项个性化规定的契约文件。如同城生活服务条款内容与本协议内容存在冲突，以同城生活服务条款内容为准。</p>',
                '</li>',
                '<li>',
                    '<h3>三、证明文件提交：</h3>',
                    '<p>（一）证明文件提交：商家欲使用本协议下服务，必须根据《同城生活2014年度招商标准》的要求向同城生活提交其在申请服务时应当提供的证明文件或其他相关证明。</p>',
                    '<p>（二）证明文件变更的通知：协议期内，上述相关证明文件的任何变更商家都应及时通知同城生活，如上述证明文件变更后导致商家不再符合《同城生活2014年度招商标准》或具备履行本协议的情形出现时，同城生活有权立即终止或中止本协议。</p>',
                    '<p>（三）同城生活将对商家的证明文件进行不定时的抽查，并有权在《同城生活2014年度招商标准》的基础上，要求商家提供更多证明文件，商家需按同城生活要求提供。如商家不能提供，则乙方有权立即终止或中止本协议。</p>',
                    '<p>（四）责任条款：商家同意为其未及时的通知或更新其证明文件或其他证明信息承担全部责任，商家保证其向同城生活提供的全部证明文件真实、准确且不存在超过时效问题（即保证所有证明文件在整个合同履行期间都处于有效期内）如因上述原因发生纠纷或被相关国家主管机关处罚，商家应当独立承担全部责任，如给同城生活（包括其合作伙伴、代理人、职员等）造成损失的，商家同意赔偿其全部损失。</p>',
                '</li>',
                '<li>',
                    '<h3>四、申请条件：</h3>',
                    '<p>申请使用服务的商家必须同时满足以下条件：</p>',
                    '<p>（一）符合《同城生活2014年度招商标准》的具体要求；</p>',
                    '<p>（二）确认接受本协议，注册成为同城生活用户并同意开通相应的支付服务；</p>',
                    '<p>（三）提交了本协议第三条约定的相关证明文件并获得同城生活认可； </p>',
                '</li>',
                '<li>',
                    '<h3>五、商家的声明与保证：</h3>',
                    '<p>（一）其符合《同城生活2014年度招商标准》规定的申请条件，且向同城生活提供真实、合法、准确、有效的注册资料，并保证其诸如电子邮件地址、联系电话、联系地址、邮政编码等内容的有效性及安全性，保证同城生活及其他用户可以通过上述联系方式与自己进行联系。同时，商家也有义务在相关资料实际变更时及时更新有关注册资料</p>',
                    '<p>（二）其承诺遵守本协议以及所有公示于同城生活的规则和流程。</p>',
                    '<p>（三）其有合法的权利缔结本协议，使用同城生活相关服务。</p>',
                    '<p>（四）其发布于同城生活的所有信息真实、准确，符合相关法律法规及同城生活规则。</p>',
                    '<p>（五）其对其发布于同城生活的交易信息中所涉商品有合法的销售权。</p>',
                    '<p>（六）其将按照不低于《中华人民共和国产品质量法》、《中华人民共和国消费者权益保护法》及其他法规、部门规章和国家强制性标准规定的要求，出售商品并提供“三包”等售后服务。</p>',
                    '<p>（七）其在同城生活出售商品，有义务按照买家实际支付的现金金额为买家开具发票，相关税收应按国家相关规定由商家自行承担。</p>',
                    '<p>（八）商家认可在同城生活平台上通过中国工商银行进行交易结算，交易金额统一保管在同城生活平台指定的公共账户上。</p>',
                    '<p>（九）其保证在使用服务进行交易的过程中遵守诚实信用的原则，不在交易过程中采取不正当竞争行为，不扰乱网上交易的正常秩序，不从事与网上交易无关的行为。</p>',
                    '<p>（十）其保证在使用服务时实施的所有行为均遵守国家法律、法规和同城生活的相关规则、规定以及各种社会公共利益及公共道德。如有违反导致任何法律后果的发生，商家将以自己的名义独立承担所有相应的法律责任。</p>',
                    '<p>（十一）其同意不对同城生活上任何数据作商业性利用，包括但不限于在未经同城生活事先书面批准的情况下，以复制、传播或向他方披露等方式使用在同城生活平台上其他用户展示的任何资料。</p>',
                    '<p>（十二）其承诺对其店铺专用BBS负有管理义务，对其店铺专用BBS出现的违反国家有关法律、法规规定及同城生活规则的信息予以立即删除。</p>',
                    '<p>（十三）其承诺拥有合法的权利和资格向同城生活平台上传有关商品销售信息并进行销售，且前述行为未对任何第三方合法权益，包括但不限于第三方知识产权、物权等构成侵害，如因其行为导致同城生活平台遭受任何第三方提起的索赔，诉讼或行政责任，其将承担相应责任并使同城生活平台免责。</p>',
                    '<p>（十四）其任何在线接受本协议的行为并不当然导致本协议发生法律效力，本协议是附条件生效协议，即必须经过同城生活对其提交的全部资料审核通过且满足本协议约定的生效条件后方可生效。同时，其认可同城生活有权独立的对其入驻资料、品牌经营权限开通申请进行评估、判断。审核结果以同城生活平台评估、判断为准，其对此不持有任何异议。</p>',
                    '<p>（十五）其承诺不在发布的商品中使用任何未获授权品牌的关键字。</p>',
                    '<p>（十六）其承诺接受同城生活平台对其出售商品是否具有合法进货来源的不定期检查，其有义务保留其商品具有合法进货来源的相关凭证。对于无法提供合法进货来源凭证的，同城生活平台将根据实际情况对商品的真伪作出判断并根据本协议以及同城生活相关规则进行处理，商家对此承担举证不利的后果。</p>',
                    '<p>（十七）其承诺接受同城生活平台基于商品品质控制需求对其在售商品进行的质量抽检，检测报告由专业的第三方质检机构出具，其承诺对同城生活平台选择的第三方质检机构作出的检测结果不持有异议。对于经检测证明存在质量瑕疵的商品，检测费用由商家承担。</p>',
               '</li>',
               '<li>',
                    '<h3>六、消费者保障：</h3>',
                    '<p>消费者保障，只指商家根据本协议约定的条款和条件及同城生活平台其他公示规则的规定，通过同城生活（www.tcsh.me）发布商品信息并利用同城生活提供的电商服务向消费者出售全新商品时，应履行“商品如实描述”、“商品7天无理由退换货”、“正品保障”义务。同城生活将在同城生活平台不时公示新增的消费者保障义务或对原消费者保障义务内容进行修订。如您对新增或修订的消费者保障义务持有异议，您应当终止本协议，如继续使用同城生活平台服务，则意味着接受同城生活的新增或修订内容</p>',
                    '<p>（一）消费者保障内容：</p>',
                    '<p>在商家通过同城生活网站（www.tcsh.me）发布商品信息以及与买家进行商品交易过程中，商家承诺遵守以下约定：</p>',
                    '<p>1．“如实描述”义务，指对上传于同城生活平台的商品信息进行如实描述，并对描述的商品信息负有举证责任。有效的“如实描述”应涵盖以下内容：</p>',
                    '<p>（1）商家在发布商品时选择及填写的所有与商品本身有关的信息，包括但不限于文字描述、商品图片，买家均可在该商品的详情页面上进行直接查看；</p>',
                    '<p>（2）商家与买家在交易过程中进行沟通时，商家就商品本身信息、邮费、发货情况、交易附带物件向买家描述的内容也属于“商品描述信息”范围。商品功效信息及商品货源渠道信息描述则不属于“商品描述信息”范围；</p>',
                    '<p>（3）商家有义务对商品本身存在的质量问题及瑕疵承担责任，除非商家已事先进行了质量问题及瑕疵的描述；</p>',
                    '<p>（4）如商家发布商品，应当使用实物拍摄图片，即商家针对该件商品本身实际拍摄的图片，不包括杂志图片、官方网站图片及宣传图片。如商家违反本条款之约定，则视为商家违反了商品如实描述义务；</p>',
                    '<p>2．“7天无理由退换货”义务：指当买家购买商家出售的商品，在签收货物后7天内，如因买家主观原因不愿完成本次交易，商家承诺同意按照本协议之约定向买家提供退换货服务。</p>',
                    '<p>（1）商家同意依据同城生活在网站公示的内容（包括但不限于同城生活7天无理由退换货服务规范）提供7天无理由退换货服务。</p>',
                    '<p>（2）商家同意一旦买家在收到货物后7天内向商家提出7天无理由退换货服务申请，商家应积极配合，与买家主动协商，以其双方自愿友好达成退货退款协议。针对包邮商品的换货申请，商家同意承担再次发货之运费。前述买家签收货物的时间以物流签收单上确定的时间为准，如物流签收单上有准确签收时间的，则该签收时间后满168小时为7天；如物流签收单上的签收时间仅为日期的，则以该日期后的第二天零时起计算时间，满168小时为7天；</p>',
                    '<p>（3）商家同意一旦买家在收到货物后提出以“7天无理由退换货”为退货原因的退款申请，商家应积极配合，并根据同城生活的要求在指定期间内提供真实、合法、有效的证据材料。根据商品类目不同，商家应根据同城生活通知的要求提交不同的证据材料，且同城生活有权根据维权处理情况要求商家进一步提供其它证明材料；</p>',
                    '<p>（4）商家同意同城生活在处理买家的“7天无理由退换货”赔付申请或相关退货申请时，有权以普通或非专业人员的知识水平标准对商家和买家提交的证据材料进行表面审核，并依据该材料作出判断。如因商家和买家提交的证据材料导致同城生活判断错误造成损害，同城生活不承担任何责任，商家同意自行向受益人索赔；</p>',
                    '<p>（5）如商家未能在指定期间内提供相关证据材料，或相关证据材料明显无效，同城生活判定买家赔付申请成立，商家同意按照本协议之约定向买家赔偿其受到的损失，赔偿金额为买家已实际支付的商品价款。此等情形下，同城生活有权在公共账户下直接扣除相应金额款项先行赔付给买家。</p>',
                    '<p>3.“遵守承诺”义务：指商家应当严格遵守通过各种方式直接或间接向买家作出的承诺，包括但不限于通过本协议、同城生活相关规则、同城生活服务协议以及网络店铺、商品详情页面、其他即时沟通等方式向买家作出的承诺。</p>',
                    '<p>4.“正品保障”义务：指当买家购买商家在同城生活平台出售的商品，在收到货物后，如买家认为该商品为假冒（包括盗版）商品货或非原厂正品、未经报关进口商品、假冒材质成份商品（其中假冒商品、未经报关进口商品、假冒材质成份商品的定义以同城生活规则规定为准）且买家与商家协商未果的前提下，买家在同城生活指定期间内发起针对商家的维权，申请消费者保障赔付时，如同城生活判定买家赔付申请成立，商家同意按照本协议之约定向买家退回其实际支付的商品价款，并增加赔偿其受到的损失，增加赔偿的金额为买家实际支付商品价款的四倍，并承担维权所涉商品所有物流费用。部分特殊类目商品（如食品）的赔付办法，如国家相关法律法规规定的赔付标准高于本协议的，商家同意以法律法规规定为准。</p>',
                    '<p>（二）消费者保障责任及处理：</p>',
                    '<p>1．商家明确了解并同意商家是消费者保障的责任主体。当发生本协议前述商家应当履行消费者保障义务情形时，商家应保证买家的消费者权益。对于买家因前述问题提出的要求，商家应积极处理。</p>',
                    '<p>2．商家同意当同城生活平台受理买家提出的消费者保障维权和赔付申请时，商家应积极配合，在同城生活平台要求的时间期限内提供相关证据材料，以证明与买家交易的商品不存在买家提出的问题或符合双方的约定，并保证所提交的证据材料真实、合法。如商家违反本约定，同城生活平台有权在商家账户余额中进行先行赔付并屏蔽店铺，如余额不足以赔付，同城生活平台有权对商家店铺进行封店。其他责任由交易双方自行协商处理。</p>',
                    '<p>（三）有限责任：</p>',
                    '<p>商家了解并同意，同城生活及其关联公司并非司法机构，仅能以普通或非专业人员的知识水平标准对商家提交的证据材料进行鉴别，同城生活及其关联公司对交易纠纷的调处完全是基于商家的委托，同城生活及其关联公司无法保证交易纠纷处理结果符合商家的期望，也不对交易纠纷调处结果及保证金赔付决定承担任何责任。商家应保证其提交的证据材料的真实性、合法性，并承担其或买家提供的信息、数据不实的风险和责任。如商家因此遭受损失，商家同意自行向受益人索赔。</p>',
               '</li>',
               '<li>',
                    '<h3>七、同城生活的权利和义务：</h3>',
                    '<p>（一）同城生活有义务在现有技术上维护整个同城生活网上交易平台的正常运行，并努力提升和改进技术，使商家网上交易活动得以顺利进行；同城生活有权根据商家营业执照的经营范围以及商家对自己店铺经营范围的描述自行决定（调整）允许商家发布商品的同城生活商品类目种类和数量，商家对此不持任何异议。</p>',
                    '<p>（二）对商家在注册使用服务中所遇到的与交易或注册有关的问题及反映的情况，同城生活应及时作出回复。</p>',
                    '<p>（三）因网上交易平台的特殊性，同城生活没有义务对所有商家的交易行为以及与交易有关的其它事项进行事先审查，但如存在下列情况：</p>',
                    '<p>①第三方通知同城生活，认为某个具体商家或具体交易事项可能存在重大问题；</p>',
                    '<p>②商家或第三方向同城生活告知交易平台上有违法或不当行为的；</p>',
                    '<p>③同城生活发现某个具体商家或具体交易事项可能存在重大问题。 同城生活以普通非专业人员的知识水平标准对相关内容进行判别，可以认为这些内容或行为具有违法或不当性质的，同城生活有权根据不同情况选择删除相关信息、对商家店铺采取限制性措施或停止对该商家提供服务，涉及违反国家强制性法律的、侵犯他人合法权利的、违反合同约定的追究相关法律责任。</p>',
                    '<p>（四）同城生活有权对商家的注册数据及交易行为进行查阅，发现注册数据或交易行为中存在任何问题或怀疑，均有权向商家发出询问或要求改正的通知，或者直接作出删除或对商家店铺采取限制性措施等处理。</p>',
                    '<p>（五）经国家生效法律文书或行政处罚决定确认商家存在违法行为，或者同城生活有足够事实依据可以认定商家存在违法或违反协议行为的，同城生活有权在同城生活网站公布商家的违法和/或违规行为。</p>',
                    '<p>（六）对于商家在同城生活网上交易平台发布的下列各类信息，同城生活有权在不通知商家的前提下进行删除或采取其它限制性措施，包括但不限于以规避费用为目的的信息；以炒作信用、销量为目的的信息；同城生活有理由相信存在欺诈等恶意或虚假内容的信息；同城生活有理由相信与网上交易无关或不是以交易为目的的信息；同城生活有理由相信存在恶意竞价或其它试图扰乱正常交易秩序因素的信息；同城生活有理由相信属违反公共利益或可能严重损害同城生活和/或其它用户合法利益的信息。</p>',
                    '<p>（七）商家在此授予同城生活免费的许可使用权利(并有权对该权利进行再授权)，使同城生活有权(全部或部份地)使用、复制、修订、改写、发布、翻译、分发、执行和展示商家公示于其同城生活网络店铺的各类信息或制作其派生作品，和/或以现在已知或日后开发的任何形式、媒体或技术，将上述信息纳入其它作品内；但该种授权不得用于乙方单方面谋利或者损害授权人利益。</p>',
                    '<p>（八）同城生活会在商户的计算机上设定或取用同城生活cookies。同城生活允许那些在同城生活网页上发布广告的公司到商家计算机上设定或取用cookies。在商家登录时获取数据，同城生活使用cookies可为商家提供个性化服务。如果拒绝cookies，商家将不能使用服务。</p>',
               '</li>',
               '<li>',
                    '<h3>八、费用规定：</h3>',
                    '<p>商家同意，就其使用的服务向同城生活支付以下服务费用：（具体以《同城生活服务条款》及公告通知为准）。</p>',
                    '<p>同城生活平台的社长根据商家产品情况与商家自定佣金，佣金比例从1%—6%不等</p>',
               '</li>',
               '<li>',
                    '<h3>九、商家付费及提现条款：</h3>',
                    '<p>（一）商家认可在同城生活平台经营期间，款项通过由同城生活平台设定的公共账户流通。</p>',
                    '<p>（二）由于款项结算涉及跨行转款的手续费，甲方认可一旦产生退货，每笔退款向同城生活支付5‰的费用作为资金管理费，以抵偿结算转账手续费。</p>',
               '</li>',
               '<li>',
                    '<h3>十、服务的开通：</h3>',
                    '<p>（一）服务将在以下条件均满足后十四（14）个工作日内开通：</p>',
                    '<p>1.商家签署本协议（书面签署或在线点击接受）；</p>',
                    '<p>2.商家在线填写信息并最终与同城生活通过在线填空点击（或书面）的方式签订《同城生活服务条款》；</p>',
                    '<p>3.符合《同城生活2014年度招商标准》规定的条件并提供相应的证明文件；</p>',
                    '<p>4.同城生活审核通过并向商家登记的手机和邮箱发出服务开通通知。</p>',
                    '<p>（二）服务期自服务实际开通日起算。同城生活将按本协议规定的通知方式提前一天通知商家服务开通日，节假日顺延。</p>',
                    '<p>（三）如商家签署或在线接受本协议后十四（14）个工作日内仍未满足本条第一款规定的所有开通条件，或同城生活因任何原因向商家发出拒绝提供服务的书面通知，则同城生活有权不予开通服务，本协议不生效。</p>',
               '</li>',
               '<li>',
                    '<h3>十一、协议的终止：</h3>',
                    '<p>（一）自然终止：本协议到期终止或因其他不可抗拒力导致终止。</p>',
                    '<p>（二）通知解除：协议任何一方均可以提前十五天（15）书面通知的方式终止本协议。 如商家通过在线点击“确认退出”按钮申请终止本协议，则系统会立即使商家的店铺进入“监管”状态，十五天（15）后店铺正式进入退出流程，商家在退出流程后三十天（30）内可以且尽可以处理交易纠纷以及与同城生活之间的账务、发票结算事宜。</p>',
                    '<p>（三）同城生活单方解除权：如商家违反同城生活的任何规则或本协议中的任何承诺或保证，包括但不限于本协议项下的任何约定，同城生活都有权立刻终止本协议，且按有关规则对商家进行处罚。如商家销售假冒他人商标（版权）的商品、外贸商品（包括但不限于：外单、原单、尾单、剪标等各类商品），二手商品，或第三方多次投诉其商品质量或服务质量，则同城生活有权立即终止或中止本协议。</p>',
                    '<p>（四）商家超过九十天（90）未以同城生活服务账户及密码登录同城生活的，同城生活有权终止本协议。</p>',
                    '<p>（五）本协议规定的其他协议终止条件发生或实现，导致本协议终止。</p>',
                    '<p>（六）协议终止后有关事项的处理：</p>',
                    '<p>1．协议终止后，同城生活没有义务为商家保留同城生活服务账户中或与之相关的任何信息，或转发任何未曾阅读或发送的信息给商家或第三方。亦不就终止协议而对商家或任何第三者承担任何责任；</p>',
                    '<p>2．无论本协议因何原因终止，在协议终止前的行为所导致的任何赔偿和责任，商家必须完全且独立地承担；</p>',
                    '<p>3．协议终止后，同城生活有权保留该商家的注册数据及以前的交易行为记录。如商家在协议终止前在同城生活网络交易平台上存在违法行为或违反协议的行为，同城生活仍可行使本协议所规定的权利；</p>',
                    '<p>4．协议终止之前，1）商家已经上传至同城生活网站的商品信息尚未达成交易协议的，同城生活有权在协议终止时同时删除此项商品的相关信息；2）商家已经与另一用户就某商品信息达成交易协议的，同城生活可以不删除该项交易，但同城生活有权在协议终止的同时将协议终止的情况通知该交易中的买方；</p>',
                    '<p>5．因为上述各项原因导致同城生活终止本服务协议，商家店铺在同城生活作出终止本服务协议时立即进入退出流程，商家在进入退出流程三十天（30）内可以且尽可以处理交易纠纷以及与同城生活之间的账务、发票结算事宜；</p>',
                    '<p>（七）如在协议期内，非因商家违约或过错导致本协议终止，则商家有权凭同城生活就本协议开具的发票原件（如已开具）及退款申请要求同城生活退还未履行部分的服务费用（如有的话）至商家指定的银行账户。其他情况下协议发生终止，未履行服务费用均不予退还。除本协议特别规定外，推广活动费用在任何情况下都不予退回。</p>',
               '</li>',
               '<li>',
                    '<h3>十二、保密条款：</h3>',
                    '<p>（一）本协议所称商业秘密包括但不限于本协议、任何补充协议所述内容及在合作过程中涉及的其他秘密信息。任何一方未经商业秘密提供方同意，均不得将该信息向任何第三方披露、传播、编辑或展示。协议方承诺，本协议终止后仍承担此条款下的保密义务，保密期将另行持续三年。</p>',
                    '<p>（二）因对方书面同意以及国家行政、司法强制行为而披露商业秘密的，披露方不承担责任；该商业秘密已为公众所知悉的，披露方不承担责任。</p>',
               '</li>',
               '<li>',
                    '<h3>十三、反不正当谋利：</h3>',
                    '<p>商家不得通过不正当手段谋取利益。如有违反，无论商家是否实际获得利益，同城生活均有权立即终止向商家名下部分或所有同城生活店铺提供服务，同时同城生活有权要求赔付赔偿金。</p>',
               '</li>',
               '<li>',
                    '<h3>十四、同城生活的法律地位：</h3>',
                    '<p>动购物仅作为用户物色交易对象，就货物和服务的交易进行协商，以及获取各类与贸易相关的服务的平台。本协议的签署并不意味着同城生活成为商家在同城生活网站上与第三方所进行交易的参与者，对前述交易同城生活仅提供技术服务，不对商家行为的合法性、有效性及商品的真实性、合法性和有效性作任何明示或暗示的担保。商家因进行交易、获取有偿服务或接触同城生活服务器而发生的所有应纳税赋，均由商家自行负责支付。</p>',
               '</li>',
               '<li>',
                    '<h3>十五、有限责任：</h3>',
                    '<p>（一）服务将按"现状"和按"可得到"的状态提供。同城生活在此明确声明对服务不作任何明示或暗示的保证，包括但不限于对服务的可适用性，没有错误或疏漏，持续性，准确性，可靠性，适用于某一特定用途之类的保证，声明或承诺。同城生活对服务所涉的技术和信息的有效性，准确性，正确性，可靠性，质量，稳定，完整和及时性均不作承诺和保证。</p>',
                    '<p>（二）使用服务下载或者获取任何资料的行为均出于商家的独立判断并自行承担风险。每一个商家独自承担因此对其电脑系统或资料灭失造成的损失。</p>',
                    '<p>（三）不论在何种情况下，同城生活均不对由于Internet连接故障，电脑，通讯或其他系统的故障，电力故障，罢工，劳动争议，暴乱，起义，骚乱，生产力或生产资料不足，火灾，洪水，风暴，爆炸，不可抗力，战争，政府行为，国际、国内法院的命令或第三方的不作为而造成的不能服务或延迟服务承担责任。</p>',
               '</li>',
               '<li>',
                    '<h3>十六、违约责任：</h3>',
                    '<p>（一）商家同意赔偿由于使用服务（包括但不限于将商家资料展示在网站上）或违反本协议而给同城生活造成的任何损失（包括但不限于由此产生的全额的诉讼费用和律师费）。商家同意同城生活不对任何商家张贴的资料，包括诽谤性的、攻击性的或非法的资料承担任何责任；由于此类材料对其它用户造成的损失由家自行承担全部责任。</p>',
                    '<p>（二）商家承诺，不会采取任何手段或措施，包括但不限于明示或暗示用户或通过其他方式转移其可以通过同城生活网络平台在线达成的交易，否则将视为严重违约，同城生活将有权立即终止本协议并对违约行为向商家追偿。</p>',
                    '<p>（三）除本协议及同城生活规则另有约定之外，如一方发生违约行为，守约方可以书面通知方式要求违约方在指定的时限内停止违约行为，并就违约行为造成的损失进行索赔，如违约方未能按时停止违约行为，则守约方有权立即终止本协议。</p>',
               '</li>',
               '<li>',
                    '<h3>十七、争议解决及其他：</h3>',
                    '<p>（一）本协议之解释与适用，以及与本协议有关的争议，均应依照中华人民共和国法律予以处理，并以浙江省杭州市拱墅区人民法院为第一审管辖法院。</p>',
                    '<p>（二）如本协议的任何条款被视作无效或无法执行，则上述条款可被分离，其余部份则仍具有法律效力。</p>',
                    '<p>（三）同城生活于商家过失或违约时放弃本协议规定的权利的，不得视为其对商家的其他或以后同类之过失或违约行为弃权。</p>',
               '</li>',
               '<li>',
                    '<h3>十八、协议效力：</h3>',
                    '<p>本协议有效期一年，自甲方签字盖章的次日算起，协议到期前30天，双方可视本协议的执行情况和具体需求续约，协议到期且双方均无续约意向则本协议自动终止。</p>',
               '</li>',
               '<li>',
                    '<h3>十九、协议附件清单：</h3>',
                    '<p>协议附件是本协议的组成部分，与本协议条款具有同等法律效力，本协议正文另有约定的除外。</p>',
               '</li>',
            '</ul>',
        '</div>'
    ].join('');
    exports.show = function (callback) {
        return box.alert({
            boxCls: "pactbox",
            titleText: "同城生活电商协议",
            content: businesshtml,
            btns: [
                {
                    cls: 'ui_btn_h26red14',
                    res: 'agree_and_register',
                    text: '同意',
                    callback: function () {
                        if (typeof callback === "function") {
                            callback();
                        } else {
                            lib.cookie("agree_and_register", "true");
                            window.location.href = domains.account+"/seller/reg";
                        }
                    }
                }
            ],
            callback: function () {
                this.close = this.hide;
                //this.wmBox.find(".wmBox-head .close").remove();
            }
        });
    };

});
