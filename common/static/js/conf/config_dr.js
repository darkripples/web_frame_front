
let ROOT_SUFFIX_DR = ROOT + "app_dr/";

// 基础功能
let URL_DR = {
    // 获取sid
    VCODE_SID: ROOT_SUFFIX_DR + 'authc/vcodeSid/',
    // 获取验证码图
    VCODE_PIC: ROOT_SUFFIX_DR + 'authc/sid2pic/',
    // 登录
    DO_LOGIN: ROOT_SUFFIX_DR + 'authc/login/',

    // 注册-发送email验证码
    REG_SEND_EMAIL: ROOT_SUFFIX_DR + 'authc/emailReg/',
    // 注册-发送短信验证码
    REG_SEND_SMS: ROOT_SUFFIX_DR + 'authc/smsReg/',
    // 注册-提交注册
    DO_REG: ROOT_SUFFIX_DR + 'authc/userReg/',

    // 登出
    DO_LOGOUT: ROOT_SUFFIX_DR + 'user/logout/',
    // 获取用户信息
    USER_GET_INFO: ROOT_SUFFIX_DR + 'user/getInfo/',

    // 修改密码
    USER_MOD_PWD: ROOT_SUFFIX_DR + 'user/modPwd/',

    // 重置密码-发送短信验证码
    USER_SET_PWD_SEND_SMS: ROOT_SUFFIX_DR + 'user/smsSetPwd/',
    // 重置密码-发送email验证码
    USER_SET_PWD_SEND_EMAIL: ROOT_SUFFIX_DR + 'user/emailSetPwd/',
    // 重置密码-提交
    USER_SET_PWD_SAVE: ROOT_SUFFIX_DR + 'user/resetPwd/',

    // 文件上传
    UPLOAD_FILE: ROOT_SUFFIX_DR + 'uploadFile/',

};

let URL_MANAGE = {
    // 获取用户信息
    USER_INFO: URL_DR.USER_GET_INFO,
    // 获取token下的菜单
    GET_USER_MENU: ROOT_SUFFIX_DR + 'menuRole/getAllMenu2List/',

    // 角色列表
    GET_ROLE_LIST: ROOT_SUFFIX_DR + 'user/role/list/',
    // 保存角色信息
    DO_ROLE_SAVE: ROOT_SUFFIX_DR + 'user/role/save/',
    // 删除角色信息
    DO_ROLE_DEL: ROOT_SUFFIX_DR + 'user/role/del/',
    // 获取角色下的菜单及所有菜单
    GET_ROLE_MENU: ROOT_SUFFIX_DR + 'menuRole/menuAllList/',
    // 保存角色下的菜单
    SAVE_ROLE_MENU_RIGHTS: ROOT_SUFFIX_DR + 'menuRole/saveRights/',

    // 用户列表
    GET_USER_LIST: ROOT_SUFFIX_DR + 'user/list/',

    // 菜单列表
    GET_MENU_LIST: ROOT_SUFFIX_DR + 'menuRole/menuList/',
    // 菜单列表-带pid的树形
    GET_MENU_DISPLAY: ROOT_SUFFIX_DR + 'menuRole/menuDisplay/',
    // 删除菜单
    DO_MENU_DEL: ROOT_SUFFIX_DR + 'menuRole/menuDel/',
    // 保存菜单
    DO_MENU_SAVE: ROOT_SUFFIX_DR + 'menuRole/menuSave/',

};
