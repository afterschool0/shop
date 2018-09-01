"use strict";

let Controllers = angular.module('Controllers', []);

Controllers.controller("ContactController", ["$scope", "$log", 'MailerService', 'ZipService', '$location', '$document',
    function ($scope, $log, MailerService, ZipService, $location, $document) {

        $scope.selects = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];
        $scope.properties = ["オーナー様", "管理会社様", "デベロッパー・建築会社様", "その他"];
        //$scope.triggers = ["検索（Google・Yahooなど）", "家主の会", "友人・知人からの紹介", "講師からの紹介・告知", "弊社社員からの紹介", "新聞・雑誌", "Facebook・Twitter", "チラシを見て", "メルマガ", "その他"];
        $scope.form = {};

        $scope.change_property = () => {
            $scope.other = ($scope.form.property === "その他");
            if ($scope.other) {
                $scope.form.property = "";
            }
            is_valid();
        };

        /*$scope.change_trigger = () => {
            $scope.other2 = ($scope.form.trigger === "その他");
            if ($scope.other2) {
                $scope.form.trigger = "";
            }
            is_valid();
        };*/

        let progress =  (value) => {
            $scope.progress = value;
        };

        let error_handler =  (code, message) => {
            progress(false);
            $scope.error = message;
            $log.error(message);
        };

        let numberfilter: any = (S) => {
            let result: string = "";
            if (S) {
                Array.prototype.forEach.call(S, (c) => {
                    let C = c.charCodeAt(0);
                    if (C <= 0x3A) {
                        if (C >= 0x30) {
                            result += String.fromCharCode(C);
                        }
                    } else {
                        if (C >= 0xFE10) {
                            if (C <= 0xFF19) {
                                let CC = C - 0xFEE0;
                                result += String.fromCharCode(CC);
                            }
                        }
                    }
                });
            }
            return result;
        };

        let hiraganaToKatagana =  (src) => {
            if (src) {
                return src.replace(/[\u3041-\u3096]/g, function (match) {
                    let chr = match.charCodeAt(0) + 0x60;
                    return String.fromCharCode(chr);
                });
            } else {
                return "";
            }
        };

        let scroll_to = (id, offset) => {
            let someElement = angular.element(document.getElementById(id));
            if (someElement) {
                try {
                    $document.scrollToElement(someElement, offset, 2000);
                } catch (e) {
                }
            }
        };

        let if_null = (src) => {
            return (!src);
        };

        let if_null_to_jump = (src, params) => {
            let result = true;
            if (!src) {
                if (params.id) {
                    if (params.offset) {
                        $scope.balloon_target = params.id;
                        scroll_to(params.id, params.offset);
                    }
                }
            } else {
                result = false;
            }
            return result;
        };

        progress(false);

        $scope.scroll_to = scroll_to;

        let validators: any[] = [
            {
                out_of_form: false,
                fieldname: "property",
                displayname: "ご職業・業種",
                validator: if_null,
                method: if_null_to_jump,
                params: {id: "property0", offset: 140}
            },
            {
                out_of_form: false,
                fieldname: "username",
                displayname: "お名前",
                validator: if_null,
                method: if_null_to_jump,
                params: {id: "username", offset: 130}
            },
            {
                out_of_form: false,
                fieldname: "furigana",
                displayname: "お名前(フリガナ)",
                validator: if_null,
                method: if_null_to_jump,
                params: {id: "furigana", offset: 120}
            },
            {
                out_of_form: false,
                fieldname: "contacttel",
                displayname: "連絡先電話番号 ",
                validator: if_null,
                method: if_null_to_jump,
                params: {id: "contacttel", offset: 110}
            },
            {
                out_of_form: false,
                fieldname: "thanks",
                displayname: "メールアドレス",
                validator: if_null,
                method: if_null_to_jump,
                params: {id: "contactmail", offset: 100}
            },
            {
                out_of_form: false,
                fieldname: "zip",
                displayname: "郵便番号(ご自宅)",
                validator: if_null,
                method: if_null_to_jump,
                params: {id: "zip", offset: 90}
            },
            {
                out_of_form: false,
                fieldname: "pref",
                displayname: "都道府県(ご自宅)",
                validator: if_null,
                method: if_null_to_jump,
                params: {id: "pref", offset: 80}
            },
         /*   {
                out_of_form: false,
                fieldname: "social_gathering",
                displayname: "懇親会へのご参加",
                validator: if_null,
                method: if_null_to_jump,
                params: {id: "social_gathering", offset: 70}
            },
            {
                out_of_form: false,
                fieldname: "person_together",
                displayname: "同伴者の有無",
                validator: if_null,
                method: if_null_to_jump,
                params: {id: "person_together", offset: 60}
            },
            {
                out_of_form: false,
                fieldname: "trigger",
                displayname: "セミナーをお知ったきっかけ",
                validator: if_null,
                method: if_null_to_jump,
                params: {id: "trigger0", offset: 50}
            },*/
            {
                out_of_form: true,
                fieldname: "personal_information",
                displayname: "個人情報の取扱いについて",
                validator: if_null,
                method: if_null_to_jump,
                params: {id: "personal_information", offset: 40}
            }
        ];

        $scope.invalid_fields_count = validators.length;
        let is_valid = () => {
            $scope.invalid_fields = "";
            $scope.invalid_fields_count = 0;
            Array.prototype.forEach.call(validators, (validator) => { // filter fields
                let raw_value = null;
                if (validator.out_of_form) {
                    raw_value = $scope[validator.fieldname];
                } else {
                    raw_value = $scope.form[validator.fieldname];
                }

                let field_invalid = validator.validator(raw_value);
                if (field_invalid) {
                    $scope.invalid_fields += validator.fieldname;
                    $scope.invalid_fields_count += 1;
                }
            });
        };

        $scope.is_valid = is_valid;

        let go_confirm = () => {

            let form_invalid: boolean = false;

            // breakable.
            for (let index = 0; index < validators.length; index++) { // scroll to invalid field.
                let raw_value: any = null;
                if (validators[index].out_of_form) {
                    raw_value = $scope[validators[index].fieldname];
                } else {
                    raw_value = $scope.form[validators[index].fieldname];
                }

                let field_invalid = validators[index].method(raw_value, validators[index].params);
                if (field_invalid) {
                    break;
                }
            }

            Array.prototype.forEach.call(validators, (validator) => { // filter fields
                let raw_value = null;
                if (validator.out_of_form) {
                    raw_value = $scope[validator.fieldname];
                } else {
                    raw_value = $scope.form[validator.fieldname];
                }

                let field_invalid = validator.validator(raw_value);
                if (field_invalid) {
                    form_invalid = true;
                }
            });

            if (!form_invalid) {

                let filters: any[] = [
                    {fieldname: "contacttel", filter: numberfilter, params: {}},
                    {fieldname: "furigana", filter: hiraganaToKatagana, params: {}},
                    {fieldname: "zip", filter: numberfilter, params: {}},
                ];

                Array.prototype.forEach.call(filters, (filter) => { // filter fields
                    let raw_value = null;
                    raw_value = $scope.form[filter.fieldname];
                    let filterd_value = filter.filter(raw_value);
                    $scope.form[filter.fieldname] = filterd_value;
                });

                let parser = document.createElement('a');
                parser.href = $location.absUrl();
                let a = parser.href.split("/");
                let h = a[a.length - 1];
                let x = '{"$and":[{"content.title.value":"' + h + '"},{"content.type.value":"seminar"}]}';

                $scope.status = 1;
            } else {
                // invalid
            }
        };

        $scope.go_confirm = go_confirm;

        $scope.status = 0;
        $scope.go_input = () => {
            $scope.status = 0;
        };

        $scope.Send = () => {
            $scope.error = "";
            progress(true);

            let form: any = $scope.form;
            MailerService.Send(form,  (result: any): void => {
                $scope.error = result.message;
                progress(false);
                $scope.status = 2;
            }, error_handler);
        };

     /*   $scope.Create = () => {
            $scope.error = "";
            progress(true);
            let form: any = $scope.form;
            AssetService.Create(form,  (result: any): void => {
                $scope.error = result.message;
                progress(false);
            }, error_handler);
        }; */

        $scope.Zip = (_ZIP) => {
            if (_ZIP) {
                let zip = numberfilter(_ZIP);
                if (zip.length > 6) {
                    progress(true);
                    ZipService.Zip(zip,  (error, result) => {
                        if (!error) {
                            if (result) {
                                let features = result.Feature;
                                if (features.length > 0) {
                                    let feature = features[0];
                                    if (feature.Property) {
                                        let property = feature.Property;
                                        if (property.AddressElement) {
                                            let address_element = property.AddressElement;
                                            if (address_element.length >= 3) {
                                                $scope.form.pref = address_element[0].Name;
                                                $scope.form.street = address_element[1].Name + address_element[2].Name;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        progress(false);
                    });
                    is_valid();
                } else {
                    $scope.form.pref = "";
                    $scope.form.street = "";
                }
            }
        };

        $scope.Ensure = (field) => {
            if (field.$error) {
                go_confirm();
            }
        };

    }]);
