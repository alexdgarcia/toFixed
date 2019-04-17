/**
 * Very simple in-browser unit-test library, with zero deps.
 *
 * Background turns green if all tests pass, otherwise red.
 * View the JavaScript console to see failure reasons.
 *
 * Example:
 *
 *   adder.js (code under test)
 *
 *     function add(a, b) {
 *       return a + b;
 *     }
 *
 *   adder-test.html (tests - just open a browser to see results)
 *
 *     <script src="tinytest.js"></script>
 *     <script src="adder.js"></script>
 *     <script>
 *
 *     tests({
 *
 *       'adds numbers': function() {
 *         eq(6, add(2, 4));
 *         eq(6.6, add(2.6, 4));
 *       },
 *
 *       'subtracts numbers': function() {
 *         eq(-2, add(2, -4));
 *       },
 *
 *     });
 *     </script>
 *
 * That's it. Stop using over complicated frameworks that get in your way.
 *
 * -Joe Walnes
 * MIT License. See https://github.com/joewalnes/jstinytest/
 */

// This object has methods that augment out TinyTest object and thus our app.
var TinyTestHelper = {
    renderStats: function(testObj, failureCount) {
        const totalTests = Object.keys(testObj).length;
        const numOfSuccessfulTests = totalTests - failureCount; // instead of creating a third var, you can just do a simple calc here
        const headerMessage = document.createElement('h1');
        headerMessage.textContent = totalTests + ' Tests: ' + numOfSuccessfulTests + ' Success, '
                                    + failureCount + ' Failure';
        document.body.appendChild(headerMessage);
    }
}

var TinyTest = {

    run: function(tests) {
        var failures = 0;
        for (var testName in tests) {
            var testAction = tests[testName];
            try {
                testAction.apply(this); // if this statement fails,control is immediately passed to catch, no other try code exe.
                // %c applies CSS style rules to the output string as specified by the second parameter
                console.log('%c' + testName, 'color: green;');
            } catch (e) {
                failures++;
                console.groupCollapsed('%c' + testName, 'color: red; font-weight: bold');
                console.error(e.stack); // console.error outputs an error message to the web console.
                // Each console.error also increments the error counter in the web console.
                console.groupEnd();
            }
        }
        setTimeout(function() { // Give document a chance to complete
            if (window.document && document.body) {
                document.body.style.backgroundColor = (failures == 0 ? '#99ff99' : '#ff9999');
            }

            // since rendering should not be intrinsic to our TinyTest obj, we will put this function into
            // another obj that augments our TinyTest obj: TinyTestHelper
            TinyTestHelper.renderStats(tests, failures);
        }, 0);
    },

    fail: function(msg = "The fail method has been invoked.") {
        throw new Error('fail(): ' + msg);
    },

    assert: function(value, msg) {
        if (!value) {
            throw new Error('assert(): ' + msg);
        }
    },

    assertEquals: function(expected, actual) {
        if (expected != actual) {
            throw new Error('assertEquals() "' + expected + '" != "' + actual + '"');
        }
    },

    assertStrictEquals: function(expected, actual) {
        if (expected !== actual) {
            throw new Error('assertStrictEquals() "' + expected + '" !== "' + actual + '"');
        }
    },

};

var fail               = TinyTest.fail.bind(TinyTest),
    assert             = TinyTest.assert.bind(TinyTest),
    assertEquals       = TinyTest.assertEquals.bind(TinyTest),
    eq                 = TinyTest.assertEquals, // alias for assertEquals
    assertStrictEquals = TinyTest.assertStrictEquals.bind(TinyTest),
    tests              = TinyTest.run.bind(TinyTest);
