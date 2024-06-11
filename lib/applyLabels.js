"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyLabels = void 0;
const core = __importStar(require("@actions/core"));
function applyLabels(context, client, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        // create labels if they don't exist
        const p = [];
        // store labels in a list; will be used later
        const labelsAll = [];
        try {
            for (const label of labels) {
                labelsAll.push(label.name);
                p.push(client.issues.createLabel({
                    owner: context.issue.owner,
                    repo: context.issue.repo,
                    name: label.name,
                    color: label.color
                }));
            }
            yield Promise.all(p);
        }
        catch (error) {
            core.info(`Obtained error: ${error}`);
            core.info(`Error status: ${error.status}`);
            // if 422, label already exists
            if (error.status !== "422") {
                throw error;
            }
        }
        // apply labels to the PR
        // don't even try if no labels
        if (labelsAll.length === 0) {
            return;
        }
        yield client.issues.addLabels({
            owner: context.issue.owner,
            repo: context.issue.repo,
            // eslint-disable-next-line @typescript-eslint/camelcase
            issue_number: context.issue.number,
            labels: labelsAll
        });
    });
}
exports.applyLabels = applyLabels;
