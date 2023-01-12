<template>
  <div class="h-full w-full flex flex-col">
    <el-button type="primary" @click="setGGG">gggggg</el-button>
    <div id="bse-edit" style="height: 100%;width: 100%"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      str: '',
      input: ''
    }
  },
  methods: {
    setGGG() {
      const strings = `<p _="9SdoZKx8hvJ-ONWo">​</p><p _="Ou5Sj_wf4WcPPIJi">​手术名称<span class="bse-element" bse-left="[" bse-right="]" contenteditable="false" bse="%7B%22bse_surgeryList%22%3A%5B%7B%22id%22%3A%220%22%2C%22type%22%3A%22%E7%B1%BB%E5%9E%8B%22%2C%22code%22%3A%22%E6%89%8B%E6%9C%AF%E7%BC%96%E7%A0%8101%22%2C%22name%22%3A%22%E7%AC%AC%E4%B8%80%E5%8F%B0%E6%89%8B%E6%9C%AF111%22%2C%22date%22%3A%222016-05-04%22%2C%22surgeryLevel%22%3A%22%E6%89%8B%E6%9C%AF%E7%AD%89%E7%BA%A7%22%2C%22doctor%22%3A%22%E6%9C%AF%E8%80%85%22%2C%22firstAssistant%22%3A%22%E4%B8%80%E5%8A%A9%22%2C%22secondAssistant%22%3A%22%E4%BA%8C%E5%8A%A9%22%2C%22incisionLevel%22%3A%22%E5%88%87%E5%8F%A3%E7%AD%89%E7%BA%A7%22%2C%22healingLevel%22%3A%22%E6%84%88%E5%90%88%E7%AD%89%E7%BA%A7%22%2C%22anesthesia%22%3A%22%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%2C%22anesthesiologist%22%3A%22%E9%BA%BB%E9%86%89%E5%8C%BB%E5%B8%88%22%7D%5D%2C%22type%22%3A%22surgery%22%2C%22name%22%3A%22%E6%89%8B%E6%9C%AF%E6%8E%A7%E4%BB%B6id%22%2C%22id%22%3A%22%E6%89%8B%E6%9C%AF%E6%8E%A7%E4%BB%B6id%22%2C%22fieldName%22%3A%22name%22%2C%22elSrc%22%3A%7B%7D%7D"><label contenteditable="true" class="placehold-class" placeholder="">
                    第一台手术111
                  </label></span>​<br></p><p _="VYhnOtnoxpn7GFcQ">手术编码<span class="bse-element" bse-left="[" bse-right="]" contenteditable="false" bse="%7B%22type%22%3A%22surgery%22%2C%22fieldName%22%3A%22code%22%2C%22name%22%3A%22%E6%89%8B%E6%9C%AF%E6%8E%A7%E4%BB%B6id%22%2C%22id%22%3A%22%E6%89%8B%E6%9C%AF%E6%8E%A7%E4%BB%B6id%22%2C%22bse_surgeryList%22%3A%5B%7B%22id%22%3A%220%22%2C%22type%22%3A%22%E7%B1%BB%E5%9E%8B%22%2C%22code%22%3A%22%E6%89%8B%E6%9C%AF%E7%BC%96%E7%A0%8101%22%2C%22name%22%3A%22%E7%AC%AC%E4%B8%80%E5%8F%B0%E6%89%8B%E6%9C%AF%22%2C%22date%22%3A%222016-05-04%22%2C%22surgeryLevel%22%3A%22%E6%89%8B%E6%9C%AF%E7%AD%89%E7%BA%A7%22%2C%22doctor%22%3A%22%E6%9C%AF%E8%80%85%22%2C%22firstAssistant%22%3A%22%E4%B8%80%E5%8A%A9%22%2C%22secondAssistant%22%3A%22%E4%BA%8C%E5%8A%A9%22%2C%22incisionLevel%22%3A%22%E5%88%87%E5%8F%A3%E7%AD%89%E7%BA%A7%22%2C%22healingLevel%22%3A%22%E6%84%88%E5%90%88%E7%AD%89%E7%BA%A7%22%2C%22anesthesia%22%3A%22%E9%BA%BB%E9%86%89%E6%96%B9%E6%B3%95%22%2C%22anesthesiologist%22%3A%22%E9%BA%BB%E9%86%89%E5%8C%BB%E5%B8%88%22%7D%5D%7D"><label style="display: inline-block;" contenteditable="true" class="placehold-class" placeholder="">手术编码01</label></span>​</p><p _="B0eJoJz9js1DRKU-">​手术类型<span class="bse-element" bse-left="[" bse-right="]" contenteditable="false" bse="%7B%22type%22%3A%22surgery%22%2C%22name%22%3A%22%E6%89%8B%E6%9C%AF%E6%8E%A7%E4%BB%B6id%22%2C%22id%22%3A%22%E6%89%8B%E6%9C%AF%E6%8E%A7%E4%BB%B6id%22%2C%22fieldName%22%3A%22type%22%7D"><label style="display: inline-block;" contenteditable="true" class="placehold-class" placeholder=""></label></span>​</p><br><p _="VfdNVdLil0u6UWv6"></p>
                  
                  
                  `;

      this._instance.execCommand(
        "inserthtmlorxmlstringbyparams",
        {
          初步诊断元素: [
            {
              id: 1,
              parentId: 0,
              bse_code: 1,
              bse_type: "中医诊断",
              bse_categery: "入院诊断",
              bse_disease_name: "肾虚",
              bse_disease_name_desc: "病描述",
              bse_symptom_name: "症名",
              bse_symptom_name_desc: "症描述",
              bse_diagnose_name: "",
              bse_diagnose_name_desc: "",
              open: true,
              checked: true,
            },
            {
              id: 11,
              parentId: 1,
              bse_code: 12,
              bse_type: "中医诊断",
              bse_categery: "入院诊断",
              bse_disease_name: "子病",
              bse_disease_name_desc: "病描述",
              bse_symptom_name: "一期症名",
              bse_symptom_name_desc: "症描述",
              bse_diagnose_name: "",
              bse_diagnose_name_desc: "",
              open: true,
              checked: true,
            },
            {
              id: 111,
              parentId: 11,
              bse_code: 123,
              bse_type: "中医诊断",
              bse_categery: "入院诊断",
              bse_disease_name: "子子病",
              bse_disease_name_desc: "病描述",
              bse_symptom_name: "二期症名",
              bse_symptom_name_desc: "症描述",
              bse_diagnose_name: "",
              bse_diagnose_name_desc: "",
              open: true,
              checked: true,
            },
          ],
          年龄元素: 28,
          姓名元素: "苏苏苏",
        },
        {
          contentXmlOrHtmlString: strings,
          paper: "A4",
          pagesizes: {
            w: 150, // 整个宽
            h: 397, // 整个高
            pt: 50, // 页边距 上
            pb: 55, // 页边距 下
            pl: 55, // 页边距 左
            pr: 55, // 页边距 右
            hh: 30.6, // 页眉
            fh: 34, // 页脚
          },
        },
        (payload) => {
          console.log(payload);
        }
      );

      const strings2 = `<p style="text-align: center;"><b style="color: var(--dark);">病程录</b><br><b style="color: var(--dark);"><br></b></p><p style="text-align: left;"><span class="bse-element" bse-left="" bse-right="" style="font-weight: bold" bse="%7B%22notallowdelete%22%3Atrue%2C%22contenteditable%22%3Afalse%2C%22type%22%3A%22label%22%2C%22name%22%3A%22%E5%A7%93%E5%90%8D%22%2C%22id%22%3A%22%E5%A7%93%E5%90%8D%22%2C%22placeholder%22%3A%22%E5%A7%93%E5%90%8D%22%7D" contenteditable="false"><label contenteditable="true" class="placehold-class" placeholder="姓名"></label></span>​<b style="color: var(--dark);"><span class="bse-element" bse-left="[" bse-right="]" bse="%7B%22forceUpdateWay%22%3A%22forceUpdate%22%2C%22type%22%3A%22input%22%2C%22name%22%3A%22%E5%A7%93%E5%90%8D%E8%BE%93%E5%85%A5%22%2C%22id%22%3A%22%E5%A7%93%E5%90%8D%E8%BE%93%E5%85%A5%22%2C%22placeholder%22%3A%22%E5%A7%93%E5%90%8D%E8%BE%93%E5%85%A5%22%7D" contenteditable="false"><label style="display: inline-block;vertical-align: text-top;" contenteditable="true" class="placehold-class" placeholder="姓名输入"></label></span>​&nbsp;&nbsp;<span class="bse-element" bse-left="" bse-right="" style="font-weight: bold" bse="%7B%22notallowdelete%22%3Atrue%2C%22contenteditable%22%3Afalse%2C%22type%22%3A%22label%22%2C%22name%22%3A%22%E5%B9%B4%E9%BE%84%22%2C%22id%22%3A%22%E5%B9%B4%E9%BE%84%22%2C%22placeholder%22%3A%22%E5%B9%B4%E9%BE%84%22%7D" contenteditable="false"><label contenteditable="true" class="placehold-class" placeholder="年龄"></label></span>​<span class="bse-element" bse-left="[" bse-right="]" bse="%7B%22forceUpdateWay%22%3A%22forceUpdate%22%2C%22type%22%3A%22input%22%2C%22name%22%3A%22%E5%B9%B4%E9%BE%84%E8%BE%93%E5%85%A5%22%2C%22id%22%3A%22%E5%B9%B4%E9%BE%84%E8%BE%93%E5%85%A5%22%2C%22placeholder%22%3A%22%E5%B9%B4%E9%BE%84%E8%BE%93%E5%85%A5%22%7D" contenteditable="false"><label style="display: inline-block;vertical-align: text-top;" contenteditable="true" class="placehold-class" placeholder="年龄输入"></label></span>​</b></p><br><br>`;
      this._instance.execCommand(
        "insertpageheaderxmlorhtmlstringbyparams",
        {
          姓名输入: "苏苏苏",
          年龄输入: 28,
        },
        {
          contentXmlOrHtmlString: strings2,
        },
        (payload) => {
          console.log(payload);
        }
      );
    }
  },
  mounted() {
    this._instance = new BSE.Editor({ el: document.querySelector('#bse-edit') })
  }
}
</script>
