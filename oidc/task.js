/**
 * OIDC Task Module
 * 任务调度模块
 * 
 * @module oidc/task
 */
const OidcTask = (function(core, network, crypto) {
    // 计时器
    let _timer = null;
    // 计步器
    let _steps = 0;

    /**
     * 定时执行任务
     * @param {Number} steps 要执行的次数
     * @param {Function} task 要执行的任务函数
     * @param {Object} param 参数
     */
    function runTask(steps, task, param) {
        core.log('Run Task, Steps:' + steps);

        if (_timer) return;
        if (!steps || steps < 1) return;

        _steps = 0;

        _timer = setInterval(() => {
            core.log('Run Task:' + _steps);
            if (_steps < steps) {
                task(param);
                _steps += 1;
            } else {
                stopTask();
            }
        }, 1000);
    }

    /**
     * 停止运行任务
     */
    function stopTask() {
        core.log('Stop Task!');
        if (_timer) {
            clearInterval(_timer);
            _timer = null;
        }
    }

    /**
     * 侦听登录状态
     * @param {Object} ticket 票据信息
     */
    function listen(ticket) {
        const digest = crypto.md5(ticket.nonce + ':' + ticket.salt);
        const key = core.getKey();
        const url = core.getOAuthUrl(`listen?client_id=${key}&ticket=${ticket.code}&digest=${digest}`);
        core.log('Listen:' + url);

        network.get(url, function(result) {
            if (!result) return;
            if (!result.success) {
                core.log(result.message);
                return;
            }

            ticket.salt = result.salt;
            if (result.handle != 3 || result.result != 2) {
                return;
            }

            const user = result.user;
            const option = core.getOption();
            const fun = option.success;
            if (fun) {
                fun(user);
            }
            stopTask();
        }, function(error) {
            core.log(error);
        });
    }

    /**
     * 开始侦听
     * @param {Object} ticket 票据信息
     */
    function runListen(ticket) {
        runTask(300, listen, ticket);
    }

    /**
     * 任务是否运行中
     */
    function isRunning() {
        return !!_timer;
    }

    return {
        runTask,
        stopTask,
        listen,
        runListen,
        isRunning
    };
})(
    typeof OidcCore !== 'undefined' ? OidcCore : require('./core'),
    typeof OidcNetwork !== 'undefined' ? OidcNetwork : require('./network'),
    typeof OidcCrypto !== 'undefined' ? OidcCrypto : require('./crypto')
);

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OidcTask;
}