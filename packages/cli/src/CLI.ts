/* eslint-disable no-console */
import { TestScheduler } from '@litert/test';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { parseArgs } from './Clap';

(async () => {

    const clArgs = parseArgs();

    if (!clArgs) {

        return;
    }

    if (!clArgs.flags['no-coverage']) {

        const p = spawn(process.argv[0], [
            '--experimental-test-coverage',
            '--enable-source-maps',
            ...process.argv.slice(1, 4),
            '--no-coverage',
            ...process.argv.slice(4),
        ], {
            stdio: 'inherit' as any
        });

        await once(p, 'close');

        return 0;
    }

    const scheduler = new TestScheduler(
        clArgs.arguments.length ? clArgs.arguments : ['.'],
        clArgs.options['filter'] ?? [],
        Number.isSafeInteger(parseInt(clArgs.options['timeout']?.[0] ?? '')) ?
            parseInt(clArgs.options['timeout'][0]) : Infinity,
        Number.isSafeInteger(parseInt(clArgs.options['default-module-timeout']?.[0] ?? '')) ?
            parseInt(clArgs.options['default-module-timeout'][0]) : Infinity,
        Number.isSafeInteger(parseInt(clArgs.options['default-case-timeout']?.[0] ?? '')) ?
            parseInt(clArgs.options['default-case-timeout'][0]) : Infinity,
    );

    await scheduler.run();

    return 0;

})().catch(console.error);
