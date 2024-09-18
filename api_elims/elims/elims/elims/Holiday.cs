using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class Holiday
{
    public int HolidayId { get; set; }

    public string? HolidayType { get; set; }

    public DateTime? HolidayDate { get; set; }

    public double? HolidayPeriod { get; set; }
}
