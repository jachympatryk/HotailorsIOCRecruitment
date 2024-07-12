import "reflect-metadata";
import {Container} from "inversify";
import {Logger} from "../commonServices/Logger";
import {ILogger} from "../commonServices/ILogger";
import {IFunctionService} from "../HttpTrigger/services/IFunctionService";
import {FunctionService} from "../HttpTrigger/services/FunctionService";
import {COMMON_TYPES} from "./commonTypes";

const getContainer: (() => Container) = (): Container => {
    const container: Container = new Container();

    container
        .bind<ILogger>(COMMON_TYPES.ILogger)
        .to(Logger)
        .inSingletonScope();

    container
        .bind<IFunctionService<any>>(COMMON_TYPES.IFunctionService)
        .to(FunctionService);

    return container;
};

export default getContainer;
