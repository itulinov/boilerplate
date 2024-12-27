
/**
 * Логирование
 * @param {string} value - значение для логирования
 * @param {string} name - название файла лога
 */
function addLog(value, name) {
    var sLogName = name
    if (sLogName == undefined) {
        sLogName = 'iTulinov'
    }

    EnableLog(sLogName)
    LogEvent(sLogName, value)
}

/**
 * Получить id элемента шаблона
 * @global {string} curOverrideWebTemplateID
 * @param {string} mode
 * @return {string}
 */
function getOverrideWebTemplateId(mode) {
    var ssql =
        "for $elem in override_web_templates where $elem/code = '" +
        mode +
        "' return $elem"
    if (mode == undefined) {
        ssql =
            "for $elem in override_web_templates where $elem/id = '" +
            curOverrideWebTemplateID +
            "' return $elem"
    }

    var overrideWebTemplate = ArrayOptFirstElem(XQuery(ssql))
    if (overrideWebTemplate == undefined) {
        throw '"Incorrect template mode"'
    }

    return String(overrideWebTemplate.id)
}

/**
 * Получить url в виде объекта
 * @global {object} Request
 * @return {object}
 */
function getObjectUrl(url) {
    var sUrl = Trim(url)
    if (sUrl == '' || url == undefined) {
        sUrl = Request.Url
    }

    var path = 'x-local://wt/web/custom_projects/libs/url_lib.js'
    var url_lib = OpenCodeLib(path)

    return url_lib.parseUrl(sUrl)
}

/**
 * Проверим, нужно ли брать doc_id
 * @param {object} params - параметры запроси из адресной строки
 * @return {boolean}
 */
function checkDocId(params) {
    if (params.mode == 'doc_type' && params.GetOptProperty('doc_id')) {
        return true
    }

    return false
}

/**
 * Проверить, нужно ли брать custom_web_template_id
 * @param {object} params - параметры запроси из адресной строки
 * @return {boolean}
 */
function checkCustomWebTemplateId(params) {
    if (params.mode != 'doc_type') {
        return false
    }

    if (!params.GetOptProperty('custom_web_template_id')) {
        return false
    }

    //if (params.GetOptProperty('doc_id') == undefined) {
    //    return false
    //}

    return true
}

/**
 * Получить id карточки, где лежат параметры для представления
 * @param {object} url
 * @return {string}
 */
function getIdCardWithParams(url) {
    // в url отсутствует mode
    if (url.params.GetOptProperty('mode', '') == '') {
        return ''
    }

    // из doc_id
    if (checkDocId(url.params)) {
        return url.params.GetOptProperty('doc_id') + ''
    }

    // из custom_web_template_id
    if (checkCustomWebTemplateId(url.params)) {
        return url.params.GetOptProperty('custom_web_template_id') + ''
    }

    // из mode
    return getOverrideWebTemplateId(url.params.mode)
}

/**
 * Получить адрес до контроллера
 * @param {string} id - идентификатор контроллера
 * @return {string}
 */
function getUrlToController(id) {
    var localUrl = 'custom_web_template.html?object_id='
    return localUrl + String(id)
}

/**
 * Получение параметров/wvars для приложения
 * @param {string} mode
 * @return {object}
 */
function getParam(url) {
    var oUrl = getObjectUrl(url)
    var sIdOfParams = getIdCardWithParams(oUrl)
    if (sIdOfParams == '') {
        return {}
    }

    var cardWvars = OpenDoc(UrlFromDocID(Int(sIdOfParams))).TopElem.wvars

    var params = tools.wvars_to_object(cardWvars)
    params.url_to_api = getUrlToController(String(params.controller_id))

    return params
}
