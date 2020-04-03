"use strict";

const penTblRowTemplate = `
    <tr>
    <td class="pen-table-row-index pt-3-half text-center">__INDEX__</td>
    <td class="pen-table-row-type pt-3-half text-center">
        <select class="pen-table-row-type-select custom-select" style="width: 100%;box-sizing: border-box;">
            <option value="unknown"></option>
            <option>DSC</option>
            <option>RPT</option>
            <option>SN</option>
        </select>
    </td>
    <td class="pen-table-row-quality pt-3-half text-center">
        <select class="pen-table-row-quality-select custom-select" style="width: 100%;box-sizing: border-box;">
            <option value="unknown"></option>
            <option>good</option>
            <option>noisy</option>
            <option>bad</option>
            <option>no signal</option>
        </select>
    </td>
    <td class="pen-table-row-note pt-3-half">
        <input type="text" class="pen-table-row-note-text" style="width: 100%;box-sizing: border-box;"/>
    </td>
    <td class="text-center">
        <span class="table-remove">
            <button type="button" class="remove-row-btn btn btn-light no-radius btn-sm">Remove</button>
            <button type="button" class="done-row-btn btn btn-light no-radius btn-sm">Done</button>
        </span>
    </td>
    </tr>`;

const jem_data = {"penatration":[]};

$(document).ready(function() {
    $("#export-button").on("click", function(){
        jem_data.version = $("#version-input").val();
        jem_data.researcher = $("#researcher-input option:selected").val();
        jem_data.recording_date = $("#recording-date-input").val();
        jem_data.electrode_id = $("#electrode-input").val();
        jem_data.subject_id = $("#subject-input").val();
        jem_data.species = $("#species-input option:selected").val();
        jem_data.bregma_coord = {
            "X": $("#bregma-X-input").val(),
            "Y": $("#bregma-Y-input").val()
        };
        jem_data.notes = $("#jem-note").val();

        $("#penatration-tables").find(".pen-table-meta").each(function(){
            const pen_index = $(this).find(".pen-table-index").text();
            jem_data.penatration[pen_index-1].X = $(this).find(".pen-meta-X").val();
            jem_data.penatration[pen_index-1].Y = $(this).find(".pen-meta-Y").val();
            jem_data.penatration[pen_index-1].Z = $(this).find(".pen-meta-Z").val();
            jem_data.penatration[pen_index-1].quality = $(this).find(".pen-meta-quality option:selected").val();
            jem_data.penatration[pen_index-1].notes = $(this).find(".pen-meta-notes").val();
        });

        exportToJsonFile(jem_data);
    });

    $("#load-button").on("click", function(){
        alert("load function is under construction...");
    });

    $("#new-pen-button").on("click", function(){
        const countTbl = jem_data.penatration.length + 1;
        let newTable = newPenTable(countTbl);
        $("#penatration-tables").append(newTable);
        jem_data.penatration.push(newPenatration(countTbl));

        $(`#pen-table-${countTbl}`).on("click", ".new-row-btn", function(){
            //const countRow = jem_data.penatration[countTbl-1].Sessions.length + 1;
            const newTr = penTblRowTemplate; //.replace(/__INDEX__/gi, countRow);
            // $(`#pen-table-${countTbl}-table`).append(newTr);
            $(`#pen-table-${countTbl}-table tr:last`).after(newTr);
            //jem_data.penatration[countTbl-1].Sessions.push(newSession(countRow));
        });

        $(`#pen-table-${countTbl}`).on("click", ".remove-row-btn", function(){
            const targetIndex = $(this).parents('tr').children(".pen-table-row-index").first().html();

            if (targetIndex == "__INDEX__") {

            } else {
                jem_data.penatration[countTbl-1].sessions.splice(targetIndex, 1);
                console.log(`remove index ${targetIndex}`);
                // update everyone's index
                $(this).closest('table').children("tbody").find(".pen-table-row-index").each(function(){
                    const _idx = $(this).html();
                    console.log(_idx);
                    if (_idx > targetIndex && _idx != "__INDEX__") {
                        $(this).text(_idx - 1);
                    }
                });
            }

            $(this).parents('tr').detach();
        });

        $(`#pen-table-${countTbl}`).on("click", ".done-row-btn", function(){
            const countRow = jem_data.penatration[countTbl-1].sessions.length + 1;
            const thisTr = $(this).parents('tr');
            const newSes = newSession(countRow);
            newSes.Type = thisTr.find(".pen-table-row-type-select option:selected").val();
            thisTr.find(".pen-table-row-type-select").attr('disabled', true);
            newSes.Quality = thisTr.find(".pen-table-row-quality-select option:selected").val();
            thisTr.find(".pen-table-row-quality-select").attr('disabled', true);
            newSes.Notes = thisTr.find(".pen-table-row-note-text").val();
            thisTr.find(".pen-table-row-note-text").attr('disabled', true);

            //console.log(thisTr.children(".pen-table-row-index"))
            thisTr.children(".pen-table-row-index").text(`${countRow}`);
            jem_data.penatration[countTbl-1].sessions.push(newSes);

            $(this).attr('disabled', true);
        });

        $(`#pen-table-${countTbl}-remove-btn`).on("click", function(){
            $(`#pen-table-${countTbl}`).detach();
            jem_data.penatration[countTbl-1].isremoved=true;
        });

    });
    $("#new-pen-button").click();

});

function newPenTable(idx){
    const newTr = penTblRowTemplate; //.replace(/__INDEX__/gi, "1");
    var content = `
    <div id="pen-table-${idx}" class="card no-radius">
        <div class="card-header" id="heading-${idx}">
            <div class="row">
                <div class="col-11">
                    <button class="btn btn-lg btn-secondary collapse-btn" data-toggle="collapse" data-target="#collapse-${idx}" aria-expanded="true" aria-controls="collapse-${idx}">
                        Penatration #${idx}
                    </button>
                </div>
                <div class="col-1">
                    <button id="pen-table-${idx}-remove-btn" class="btn btn-outline-secondary no-radius float-right" type="button">Remove</button>
                </div>
            </div>
        </div>

        <div id="collapse-${idx}" class="collapse show" aria-labelledby="heading-${idx}">
            <div class="card-body">
                <form class="pen-table-meta">
                    <span>Penatration #</span><span class="pen-table-index">${idx}</span>
                    <div class="form-row">
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">X</span>
                                </div>
                                <input class="pen-meta-X form-control" type="text" />
                            </div>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Y</span>
                                </div>
                                <input class="pen-meta-Y form-control" type="text" />
                            </div>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Z</span>
                                </div>
                                <input class="pen-meta-Z form-control" type="text" />
                            </div>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Quality</span>
                                </div>
                                <select class="pen-meta-quality custom-select">
                                    <option value="unknown"></option>
                                    <option>good</option>
                                    <option>noisy</option>
                                    <option>bad</option>
                                    <option>no signal</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <textarea class="pen-meta-notes form-control" rows="3" placeholder="notes" style="resize: none;"></textarea>
                        </div>
                    </div>
                </form>
            <hr />
            <div id="pen-table-${idx}-table">
                <table class="table">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" scope="col">Index</th>
                            <th class="text-center" scope="col">Type</th>
                            <th class="text-center" scope="col">Quality</th>
                            <th class="text-center" scope="col">Note</th>
                            <th class="text-center" scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${newTr}
                    </tbody>
                </table>
                <hr/>
                <button class="new-row-btn btn btn-secondary" type="button">new pending</button>
            </div>
            </div>
        </div>
    </div>`;
    return content;
}

function newPenatration(idx){
    return {
        "index":idx,
        "X": NaN,
        "Y": NaN,
        "Z": NaN,
        "quality": NaN,
        "sessions":[],
        "notes":"",
        "isremoved": false,
    };
}

function newSession(idx){
    return {
        "index":idx,
        "type":"",
        "quality":NaN,
        "notes":""
    };
}

function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'jem_export.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
