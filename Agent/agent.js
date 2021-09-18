self.Agent = (function () {
    function LoggerAgent() {
        this.isTokenValidated = false;
        this.staticToken = "123456";
        this.apiBase = "http://localhost:9000"
        this.errorAPI = `${this.apiBase}/record/error`;
        this.allowedOrigin = ['http://localhost:8080', 'https://app.birdeye.com'];
        this.directoryName = "";
    }

    LoggerAgent.prototype.throttle = function(){
        
    };
    LoggerAgent.prototype.install = function (obj) {
        const { token } = obj;
        if (token == this.staticToken) {
            this.isTokenValidated = true;
            console.log("token validated sucessfully");
        }
        if (this.isTokenValidated) {
            this.watchWindowErrors();
            this.watchPromiseErrors();
            this.getLogFileName(obj);
        }

    };
    LoggerAgent.prototype.getLogFileName = function (obj) {
        const { directoryName } = obj;
        this.directoryName = directoryName;

    }

    LoggerAgent.prototype.hashCode = function (str = "") {
        var hash = 0, i, chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    LoggerAgent.prototype.sendError = function (errorJson) {
        const xhr = new XMLHttpRequest();
        const method = "POST";
        const url = this.errorAPI;
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                /*   alert(xhr.responseText); */
            }
        }
        xhr.send(errorJson)
    }

    LoggerAgent.prototype.watchWindowErrors = function () {
        const that = this;
        self.onerror = function (msg, url, lineNo, columnNo, error) {
            let string = msg.toLowerCase();
            let substring = "script error";
            if (string.indexOf(substring) > -1) {
                console.log("script error");
            } else {
                let message = [
                    "Message: " + msg,
                    "URL: " + url,
                    "Line: " + lineNo,
                    "Column: " + columnNo,
                    "Error object: " + JSON.stringify(error)
                ].join(" - ");
                var ErrorObj = {
                    "error": message, toJSON() {
                        return {
                            "errorMessage": "message", "stack":
                                "", pageUrl: window.location.href, directoryName: that.directoryName
                        }
                    }
                }



                that.sendError(JSON.stringify(ErrorObj));
            }

            return true;
        };
    }
    LoggerAgent.prototype.flatten = function (obj) {
        var result = Object.create(obj);
        for (var key in result) {
            result[key] = result[key];
        }
        return result;
    }
    LoggerAgent.prototype.watchPromiseErrors = function () {
        const that = this;

        console.log("hello");

        // self.onunhandledrejection = function (event) {

        //     //     let reason = event.reason;
        //     //     console.log(reason);
        //     //     alert(reason);
        //     //     alert("error at on promise rejection");
        //     //     that.sendError(JSON.stringify({ error: event["reason"] }));
        //     //     //networkSpace.postData("/log/logClientMessage", { clientMessage: `Browser promise error at login page`, error: "uncought promise error occured", reason });
        //     //     ///alert(message);

        //     //     return true;

        //     // };


        // }

        self.addEventListener("unhandledrejection", event => {
            var ErrorObj = {
                "error": event.reason, toJSON() {
                    return { "errorMessage": event.reason.message, "stack": event.reason.stack, pageUrl: window.location.href, directoryName: that.directoryName }
                }
            }



            that.sendError(JSON.stringify(ErrorObj));
        });
    }





    return new LoggerAgent();

})();
